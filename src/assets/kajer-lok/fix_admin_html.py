import re

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

# Find where the JS block starts
idx = content.find('<!-- JS -->')
if idx == -1:
    idx = content.find('<script src="js/i18n.js">')

if idx != -1:
    html_part = content[:idx]
else:
    # Failsafe if neither found
    html_part = content

js_part = """<!-- JS -->
<script src="js/i18n.js"></script>
<script src="js/main.js"></script>
<script src="js/auth.js"></script>
<script>
// ---- AUTH GUARD ----
const _admin = requireAuth('admin', 'login-admin.html');

document.addEventListener('DOMContentLoaded', () => {
  if (!_admin) return;
  initDashboard();
  loadAdminStats();
  // load approvals when clicking the approvals tab
  document.querySelectorAll('[data-page="pa-approvals"]').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(loadApprovals, 100));
  });
});

/* ---- Real stats from localStorage ---- */
function loadAdminStats() {
  const customers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
  const workers = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
  const bookings = getAllBookings();
  const totalRev = bookings.filter(b => ['confirmed', 'active', 'completed'].includes(b.status)).reduce((s, b) => s + (b.price || 0), 0);
  
  const pendCust = JSON.parse(localStorage.getItem('pendingCustomers') || '[]').filter(p => p.status === 'pending').length;
  const pendWork = JSON.parse(localStorage.getItem('pendingWorkers') || '[]').filter(p => p.status === 'pending').length;
  const pending = pendCust + pendWork;
  
  const vals = document.querySelectorAll('.stat-card .sc-value');
  if (vals[0]) vals[0].textContent = customers.length.toLocaleString('en-IN');
  if (vals[1]) vals[1].textContent = workers.length.toLocaleString('en-IN');
  if (vals[2]) vals[2].textContent = bookings.length.toLocaleString('en-IN');
  if (vals[3]) vals[3].textContent = '₹' + totalRev.toLocaleString('en-IN');
  if (vals[4]) vals[4].textContent = '7'; // mock pending disputes
  if (vals[5]) vals[5].textContent = pending;

  // Recent bookings table
  const tbody = document.querySelector('#pa-home .table-wrap tbody');
  if (tbody && bookings.length) {
    tbody.innerHTML = bookings.slice(0, 8).map(b => 
      `<tr>
        <td>${b.customerName || '—'}</td>
        <td>${b.workerName || '—'}</td>
        <td>${b.plan || '—'}</td>
        <td>${statusBadge(b.status)}</td>
      </tr>`
    ).join('');
  }
}

function searchTable(tableId, q) {
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  const lower = q.toLowerCase();
  rows.forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(lower) ? '' : 'none';
  });
}

function saveSettings() {
  const dhBaseRates = {
    cooking: parseInt(document.getElementById('dhCooking').value) || 80,
    dishes: parseInt(document.getElementById('dhDishes').value) || 40,
    clothes: parseInt(document.getElementById('dhClothes').value) || 40,
    mopping: parseInt(document.getElementById('dhMopping').value) || 40,
    shopping: parseInt(document.getElementById('dhShopping').value) || 30,
    cleaning: parseInt(document.getElementById('dhCleaning').value) || 30
  };
  localStorage.setItem('kajerlok_kh_rates', JSON.stringify(dhBaseRates));
  showToast(getTranslation('msg_settings_saved') || 'সেটিংস সেভ হয়েছে!', 'success');
}

/* ===== APPROVAL SYSTEM ===== */
let _lastCred = '';

// Inject document viewer modal HTML once on page load
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.createElement('div');
  modal.id = 'docViewModal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10000;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:var(--card);border-radius:16px;padding:24px;max-width:640px;width:92%;border:1px solid var(--border);position:relative;max-height:90vh;overflow-y:auto">
      <button onclick="document.getElementById('docViewModal').style.display='none'" style="position:absolute;top:12px;right:16px;background:none;border:none;color:var(--text-muted);font-size:22px;cursor:pointer">✕</button>
      <h3 id="docViewTitle" style="color:var(--text);margin-bottom:16px;padding-right:32px">পরিচয়পত্র</h3>
      <div id="docViewContent"></div>
    </div>`;
  document.body.appendChild(modal);
});

function viewDocument(regId, type) {
  const key = type === 'customer' ? 'pendingCustomers' : 'pendingWorkers';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const rec = list.find(x => x.regId === regId);
  if (!rec || !rec.docBase64) {
    showToast('ডকুমেন্ট পাওয়া যায়নি।', 'error');
    return;
  }
  const docLabels = { aadhaar: 'আধার কার্ড', voter: 'ভোটার কার্ড', pan: 'প্যান কার্ড' };
  const label = docLabels[rec.docType] || rec.docType || 'ডকুমেন্ট';
  document.getElementById('docViewTitle').textContent = `${label} — ${rec.name}`;
  
  const content = document.getElementById('docViewContent');
  if (rec.docBase64.includes('application/pdf')) {
    content.innerHTML = `<iframe src="${rec.docBase64}" style="width:100%;height:480px;border:none;border-radius:8px"></iframe>`;
  } else {
    content.innerHTML = `<img src="${rec.docBase64}" alt="${label}" style="max-width:100%;border-radius:8px;border:1px solid var(--border)"/>`;
  }
  document.getElementById('docViewModal').style.display = 'flex';
}

function docTypeBadge(dt) {
  const map = { aadhaar: 'আধার', voter: 'ভোটার', pan: 'প্যান' };
  return `<span style="background:rgba(99,102,241,.2);color:#a5b4fc;padding:2px 8px;border-radius:20px;font-size:11px">${map[dt] || dt || '—'}</span>`;
}

function genId(prefix, counter) {
  return `${prefix}-${str(counter).zfill(4)}`;
}

function genPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
  let pwd = '';
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

function loadApprovals() {
  const pendingC = JSON.parse(localStorage.getItem('pendingCustomers') || '[]').filter(x => x.status === 'pending');
  const pendingW = JSON.parse(localStorage.getItem('pendingWorkers') || '[]').filter(x => x.status === 'pending');
  const custDiv = document.getElementById('customerApprovalList');
  const workDiv = document.getElementById('workerApprovalList');
  
  if (pendingC.length === 0) {
    custDiv.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">নতুন কোনো আবেদন নেই</p>';
  } else {
    custDiv.innerHTML = `<div class="table-wrap"><table><thead><tr>
        <th>Reg ID</th><th>নাম</th><th>মোবাইল</th><th>ঠিকানা</th><th>কাজের ধরন</th><th>পরিচয়পত্র</th><th>তারিখ</th><th>অ্যাকশন</th>
      </tr></thead><tbody>${pendingC.map(c => `<tr>
        <td style="font-family:monospace;font-size:11px">${c.regId}</td>
        <td>${c.name}</td><td>${c.phone}</td>
        <td style="max-width:150px;white-space:normal;font-size:12px">${c.address}</td>
        <td>${c.workType}</td>
        <td>${docTypeBadge(c.docType)}<br/>${c.docBase64 ? `<button class="btn btn-sm btn-outline" onclick="viewDocument('${c.regId}','customer')" style="font-size:11px;padding:2px 8px;margin-top:4px">দেখুন</button>` : '<span style="color:var(--text-dim);font-size:11px">ফাইল নেই</span>'}</td>
        <td>${c.regDate}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-primary" onclick="approveCustomer('${c.regId}')" style="margin-right:4px;margin-bottom:4px">অ্যাপ্রুভ</button>
          <button class="btn btn-sm" onclick="rejectReg('${c.regId}','customer')" style="background:#EF4444;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px">বাতিল</button>
        </td>
      </tr>`).join('')}</tbody></table></div>`;
  }
  
  if (pendingW.length === 0) {
    workDiv.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">নতুন কোনো আবেদন নেই</p>';
  } else {
    workDiv.innerHTML = `<div class="table-wrap"><table><thead><tr>
        <th>Reg ID</th><th>নাম</th><th>মোবাইল</th><th>কাজের ধরন</th><th>পরিচয়পত্র</th><th>অভিজ্ঞতা</th><th>তারিখ</th><th>অ্যাকশন</th>
      </tr></thead><tbody>${pendingW.map(w => `<tr>
        <td style="font-family:monospace;font-size:11px">${w.regId}</td>
        <td>${w.name}</td><td>${w.phone}</td>
        <td>${w.workType}</td>
        <td>${docTypeBadge(w.docType)}<br/>${w.docBase64 ? `<button class="btn btn-sm btn-outline" onclick="viewDocument('${w.regId}','worker')" style="font-size:11px;padding:2px 8px;margin-top:4px">দেখুন</button>` : '<span style="color:var(--text-dim);font-size:11px">ফাইল নেই</span>'}</td>
        <td>${w.exp ? w.exp + ' বছর' : '—'}</td><td>${w.regDate}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-primary" onclick="approveWorker('${w.regId}')" style="margin-right:4px;margin-bottom:4px">অ্যাপ্রুভ</button>
          <button class="btn btn-sm" onclick="rejectReg('${w.regId}','worker')" style="background:#EF4444;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px">বাতিল</button>
        </td>
      </tr>`).join('')}</tbody></table></div>`;
  }
}

function simulateSMS(phone, idLabel, idValue, password) {
  const smsText = `কাজের লোক: অ্যাকাউন্ট অনুমোদিত!\\n${idLabel}: ${idValue}\\nPassword: ${password}\\nলগইন: http://localhost:8080\\n- ধন্যবাদ`;
  showToast(`একটি SMS যাচ্ছে ${phone}-এ...`, 'info');
  setTimeout(() => showToast(`সফলভাবে SMS পাঠানো হয়েছে ${phone}-এ`, 'success'), 1500);
  return smsText;
}

function approveCustomer(regId) {
  const list = JSON.parse(localStorage.getItem('pendingCustomers') || '[]');
  const idx = list.findIndex(x => x.regId === regId);
  if (idx === -1) return;
  
  const cust = list[idx];
  const approved = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
  const custId = `KL-C-${String(approved.length + 1001).padStart(4, '0')}`;
  const password = genPassword();
  
  approved.push({ ...cust, customerId: custId, password, status: 'approved', approvedDate: new Date().toLocaleDateString('bn-IN') });
  localStorage.setItem('approvedCustomers', JSON.stringify(approved));
  
  list[idx].status = 'approved';
  localStorage.setItem('pendingCustomers', JSON.stringify(list));
  
  const smsText = simulateSMS(cust.phone, 'Customer ID', custId, password);
  showCredModal(cust.name, 'Customer ID', custId, password, cust.phone, smsText);
  loadApprovals();
}

function approveWorker(regId) {
  const list = JSON.parse(localStorage.getItem('pendingWorkers') || '[]');
  const idx = list.findIndex(x => x.regId === regId);
  if (idx === -1) return;
  
  const worker = list[idx];
  const approved = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
  const workerId = `KL-W-${String(approved.length + 1001).padStart(4, '0')}`;
  const password = genPassword();
  
  approved.push({ ...worker, workerId, password, status: 'approved', approvedDate: new Date().toLocaleDateString('bn-IN') });
  localStorage.setItem('approvedWorkers', JSON.stringify(approved));
  
  list[idx].status = 'approved';
  localStorage.setItem('pendingWorkers', JSON.stringify(list));
  
  const smsText = simulateSMS(worker.phone, 'Worker ID', workerId, password);
  showCredModal(worker.name, 'Worker ID', workerId, password, worker.phone, smsText);
  loadApprovals();
}

function rejectReg(regId, type) {
  const key = type === 'customer' ? 'pendingCustomers' : 'pendingWorkers';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const idx = list.findIndex(x => x.regId === regId);
  if (idx !== -1) {
    list[idx].status = 'rejected';
    localStorage.setItem(key, JSON.stringify(list));
  }
  showToast('আবেদন বাতিল করা হয়েছে।', 'error');
  loadApprovals();
}

function showCredModal(name, idLabel, idValue, password, phone, smsText) {
  _lastCred = `নাম: ${name}\\n${idLabel}: ${idValue}\\nPassword: ${password}`;
  document.getElementById('credContent').innerHTML = `
    <div style="margin-bottom:6px"><strong>নাম:</strong> ${name}</div>
    <div style="margin-bottom:6px"><strong>মোবাইল:</strong> ${phone}</div>
    <div style="margin-bottom:6px"><strong>${idLabel}:</strong> <span style="color:var(--primary-light);font-size:17px;font-weight:700;letter-spacing:1px"> ${idValue}</span></div>
    <div style="margin-bottom:12px"><strong>Password:</strong> <span style="color:var(--secondary);font-size:17px;font-weight:700;letter-spacing:1px"> ${password}</span></div>
    <div style="padding:12px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);border-radius:8px;font-size:12px;white-space:pre-wrap;color:var(--text-muted);line-height:1.7"><strong>SMS Preview (${phone}):</strong>\n${smsText}</div>`;
  document.getElementById('credModal').style.display = 'flex';
}

function copyCredentials() {
  navigator.clipboard.writeText(_lastCred).then(() => showToast('আইডি ও পাসওয়ার্ড কপি করা হয়েছে!', 'success'));
}
</script>
</body>
</html>
"""

final_content = html_part + js_part
with open(filepath, 'w', encoding='utf8') as f:
    f.write(final_content)
    
print("Successfully repaired dashboard-admin.html")
