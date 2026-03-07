import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

# Fixed HTML Section for Fee Management
FEE_MANAGEMENT_HTML = """
                <!-- FEE MANAGEMENT -->
                <div class="settings-section" style="grid-column: 1 / -1;">
                  <h3 class="settings-section-title" data-i18n="setting_cat_fees">ফি ব্যবস্থাপনা</h3>
                  
                  <!-- Domestic Helper Pricing -->
                  <h4 class="settings-section-subtitle" data-i18n="label_dh_prices_title">ডোমেস্টিক হেল্পার প্রাইসিং</h4>
                  <div class="fee-pricing-grid">
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_cooking">রান্না</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhCooking" value="80" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_washing_dishes">বাসন মাজা</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhDishes" value="40" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_washing_clothes">কাপড় কাচা</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhClothes" value="40" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_mopping">ঘর মোছা</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhMopping" value="40" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_shopping">বাজার করা</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhShopping" value="30" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_dh_cleaning">ঘর পরিষ্কার</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number"
                          class="form-control" id="dhCleaning" value="30" /> </div>
                    </div>
                  </div>

                  <!-- Aya Pricing -->
                  <h4 class="settings-section-subtitle" data-i18n="label_ayah_prices">আয়া সেবা - মূল্য নির্ধারণ</h4>
                  <div class="fee-pricing-grid">
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_6h">৬ ঘণ্টা (6h)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="350" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_8h">৮ ঘণ্টা (8h)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="450" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_12h">১২ ঘণ্টা (12h)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="650" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_24h">২৪ ঘণ্টা (24h)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="1200" /> </div>
                    </div>
                  </div>

                  <!-- Babysitter Pricing -->
                  <h4 class="settings-section-subtitle" data-i18n="label_babysitter_prices">বেবিসিটার - মূল্য নির্ধারণ</h4>
                  <div class="fee-pricing-grid">
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_monthly">মাসিক (Monthly)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="10000" /> </div>
                    </div>
                    <div class="form-group"> <label class="fee-item-label" data-i18n="label_yearly">বার্ষিক (Yearly)</label>
                      <div style="display:flex;align-items:center;gap:8px"> <span>₹</span><input type="number" class="form-control" value="100000" /> </div>
                    </div>
                  </div>
                </div>
"""

JS_PART = """<!-- JS -->
  <script src="js/i18n.js"></script>
  <script src="js/main.js"></script>
  <script src="js/auth.js"></script>
  <script src="js/analytics.js"></script>
  <script>
    // ---- AUTH GUARD ----
    const _admin = requireAuth('admin', 'login-admin.html');

    document.addEventListener('DOMContentLoaded', () => {
      if (!_admin) return;
      initDashboard();
      loadAdminStats();
      renderCustomers();
      renderWorkers();
      renderReviews();
      renderAdminNotifs();
      renderAnalytics();
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
      if (!rec || !rec.docBase64) { showToast('ডকুমেন্ট পাওয়া যায়নি।', 'error'); return; }
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
      addNotification(`গ্রাহক অনুমোদিত: ${cust.name} (${custId})`, 'success');
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
      addNotification(`কর্মী অনুমোদিত: ${worker.name} (${workerId})`, 'success');
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
        <div style="padding:12px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);border-radius:8px;font-size:12px;white-space:pre-wrap;color:var(--text-muted);line-height:1.7"><strong>SMS Preview (${phone}):</strong>\\n${smsText}</div>`;
      document.getElementById('credModal').style.display = 'flex';
    }

    function copyCredentials() {
      navigator.clipboard.writeText(_lastCred).then(() => showToast('আইডি ও পাসওয়ার্ড কপি করা হয়েছে!', 'success'));
    }

    function renderCustomers() {
      const customers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
      const tbody = document.querySelector('#custTable tbody');
      if (!tbody) return;
      if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">কোনো গ্রাহক পাওয়া যায়নি</td></tr>';
        return;
      }
      const allBookings = getAllBookings();
      tbody.innerHTML = customers.map(c => {
        const count = allBookings.filter(b => b.customerId === c.customerId).length;
        return `<tr>
          <td>${c.name}</td><td>${c.phone}</td><td style="font-family:monospace">${c.customerId}</td>
          <td>${c.address || '—'}</td><td>${c.approvedDate || '—'}</td><td>${count}</td>
          <td><button class="btn btn-sm btn-outline">বিস্তারিত</button></td>
        </tr>`;
      }).join('');
    }

    function renderWorkers() {
      const workers = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
      const tbody = document.querySelector('#workTable tbody');
      if (!tbody) return;
      if (workers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">কোনো কর্মী পাওয়া যায়নি</td></tr>';
        return;
      }
      const allBookings = getAllBookings();
      tbody.innerHTML = workers.map(w => {
        const count = allBookings.filter(b => b.workerId === w.workerId).length;
        const ratingObj = getWorkerRating(w.workerId);
        return `<tr>
          <td>${w.name}</td><td>${w.phone}</td><td style="font-family:monospace">${w.workerId}</td>
          <td>${w.workType}</td><td>⭐ ${ratingObj.avg}</td><td>${count}</td>
          <td><button class="btn btn-sm btn-outline">বিস্তারিত</button></td>
        </tr>`;
      }).join('');
    }

    function renderReviews() {
      const bookings = getAllBookings().filter(b => b.rating);
      const tbody = document.querySelector('#reviewTable tbody');
      if (!tbody) return;
      if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">কোনো রিভিউ পাওয়া যায়নি</td></tr>';
        return;
      }
      tbody.innerHTML = bookings.map(b => `<tr>
        <td>${new Date(b.completedAt || b.createdAt).toLocaleDateString('bn-IN')}</td>
        <td>${b.customerName}</td><td>${b.workerName}</td>
        <td>⭐ ${b.rating}</td><td style="max-width:200px;font-size:12px">${b.comment || '—'}</td>
        <td><button class="btn btn-sm" style="background:#EF4444;color:#fff" onclick="deleteReview('${b.bookingId}')">ডিলিট</button></td>
      </tr>`).join('');
    }

    function deleteReview(bookingId) {
      if (!confirm('আপনি কি নিশ্চিত যে এই রিভিউটি ডিলিট করতে চান?')) return;
      const bookings = getAllBookings();
      const idx = bookings.findIndex(b => b.bookingId === bookingId);
      if (idx !== -1) {
        delete bookings[idx].rating;
        delete bookings[idx].comment;
        saveAllBookings(bookings);
        renderReviews();
        showToast('রিভিউ ডিলিট করা হয়েছে', 'success');
      }
    }

    function renderAdminNotifs() {
      const notifs = JSON.parse(localStorage.getItem('klNotifications') || '[]');
      const list = document.getElementById('adminNotificationList');
      const badge = document.getElementById('adminNotifBadge');
      if (!list) return;
      const adminNotifs = notifs.filter(n => !n.userId || n.userId === 'admin').sort((a, b) => b.id - a.id);
      const unread = adminNotifs.filter(n => !n.read).length;
      if (badge) { badge.style.display = unread > 0 ? 'flex' : 'none'; badge.textContent = unread; }
      if (adminNotifs.length === 0) { list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted)">কোনো নোটিফিকেশন নেই</div>'; return; }
      list.innerHTML = adminNotifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markRead(${n.id})">
          <div style="font-size:13px;line-height:1.5">${n.message}</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:4px">${new Date(n.id).toLocaleString('bn-IN')}</div>
        </div>
      `).join('');
    }

    function markAllRead() {
      const notifs = JSON.parse(localStorage.getItem('klNotifications') || '[]');
      notifs.forEach(n => { if (!n.userId || n.userId === 'admin') n.read = true; });
      localStorage.setItem('klNotifications', JSON.stringify(notifs));
      renderAdminNotifs();
    }

    function renderLeaderboard() {
      const top = getWorkerLeaderboard();
      const tbody = document.querySelector('#leaderboardTable tbody');
      if (!tbody) return;
      if (top.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">কোনো তথ্য পাওয়া যায়নি</td></tr>'; return; }
      tbody.innerHTML = top.map((w, i) => `
        <tr>
          <td style="font-weight:700; color:var(--primary)">#${i+1}</td>
          <td>${w.name}</td><td style="font-family:monospace">${w.id}</td>
          <td>⭐ ${w.rating || 0}</td><td>${w.jobs}</td>
          <td><div style="width:100px; background:rgba(255,255,255,0.05); height:8px; border-radius:4px;"><div style="width:${Math.min(w.score, 100)}%; background:var(--primary); height:100%; border-radius:4px;"></div></div></td>
        </tr>
      `).join('');
    }

    function doExport(type) {
      const data = type === 'customers' ? JSON.parse(localStorage.getItem('approvedCustomers') || '[]') : JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
      if (!data.length) { showToast('এক্সপোর্ট করার মতো কোনো তথ্য নেই', 'error'); return; }
      exportToCSV(`kajerlok_${type}_${Date.now()}.csv`, data);
      showToast('ডাউনলোড শুরু হয়েছে', 'success');
    }

    function renderAnalytics() {
      const revData = getMonthlyRevenueData();
      renderMiniChart('revenueChart', revData);
      renderLeaderboard();
    }

    function doChangePwd(type) {
      const o = document.getElementById('oldPwd').value;
      const n = document.getElementById('newPwd').value;
      if (!o || !n) { showToast('সব তথ্য দিন', 'error'); return; }
      const res = changePassword(type, o, n);
      if (res.success) {
        showToast(res.msg, 'success');
        document.getElementById('pwdModal').style.display = 'none';
      } else {
        showToast(res.msg, 'error');
      }
    }
  </script>

  <!-- PW MODAL -->
  <div id="pwdModal"
    style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;align-items:center;justify-content:center;">
    <div
      style="background:#fff;border-radius:16px;padding:32px;max-width:400px;width:92%;border:1px solid var(--border);position:relative;">
      <button onclick="document.getElementById('pwdModal').style.display='none'"
        style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;cursor:pointer">✕</button>
      <h3 style="margin-bottom:20px">পাসওয়ার্ড পরিবর্তন</h3>
      <div class="form-group">
        <label>বর্তমান পাসওয়ার্ড</label>
        <input type="password" class="form-control" id="oldPwd">
      </div>
      <div class="form-group">
        <label>নতুন পাসওয়ার্ড</label>
        <input type="password" class="form-control" id="newPwd">
      </div>
      <button class="btn btn-primary btn-full" onclick="doChangePwd('admin')">পরিবর্তন করুন</button>
    </div>
  </div>

</body>
</html>
"""

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    content = f.read()

# 1. Surgically replace the Fee Management section in HTML
# Look for the start of operations settings section
ops_start = content.find('label_maintenance_mode')
if ops_start != -1:
    section_end = content.find('btn_save', ops_start)
    if section_end != -1:
        # Find the next closing </div> for the section
        div_end = content.find('</div>', section_end + 30) # Skip the button
        # Reconstruct the HTML part including our fixed Fee section
        # We'll just replace everything from 'setting_cat_fees' to the end of the sections
        start_fees = content.find('setting_cat_fees')
        if start_fees != -1:
            # Go back to start of section div
            sec_div_start = content.rfind('<div class="settings-section"', 0, start_fees)
            
            # Find where the js block starts
            js_marker = content.find('<!-- JS -->')
            if js_marker == -1: js_marker = content.find('<script src="js/i18n.js">')
            
            if sec_div_start != -1 and js_marker != -1:
                final_html = content[:sec_div_start] + FEE_MANAGEMENT_HTML + "\\n              </div>\\n            </div>" + JS_PART
                with open(filepath, 'w', encoding='utf8') as f:
                    f.write(final_html)
                print("Dashboard Admin repaired successfully.")
            else:
                print("Could not find containers.")
        else:
             print("Could not find fee category.")
    else:
        print("Could not find save button.")
else:
    print("Could not find maintenance mode label.")
