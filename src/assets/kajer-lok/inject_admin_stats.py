import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# 1. Update the DOMContentLoaded listener to call our new render functions
old_init = """document.addEventListener('DOMContentLoaded', () => {
  if (!_admin) return;
  initDashboard();
  loadAdminStats();
  // load approvals when clicking the approvals tab
  document.querySelectorAll('[data-page="pa-approvals"]').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(loadApprovals, 100));
  });
});"""

new_init = """document.addEventListener('DOMContentLoaded', () => {
  if (!_admin) return;
  initDashboard();
  loadAdminStats();
  renderCustomers();
  renderWorkers();
  // load approvals when clicking the approvals tab
  document.querySelectorAll('[data-page="pa-approvals"]').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(loadApprovals, 100));
  });
});"""

html = html.replace(old_init, new_init)

# 2. Inject the renderCustomers and renderWorkers functions right before searchTable
render_funcs = """
function renderCustomers() {
  const customers = JSON.parse(localStorage.getItem('approvedCustomers') || '[]');
  const tbody = document.querySelector('#custTable tbody');
  if (!tbody) return;
  
  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">কোনো গ্রাহক পাওয়া যায়নি</td></tr>';
    return;
  }
  
  // Calculate bookings per customer
  const allBookings = getAllBookings();
  
  tbody.innerHTML = customers.map(c => {
    const bookingCount = allBookings.filter(b => b.customerId === c.customerId).length;
    return `<tr>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email || '—'}</td>
      <td>${c.approvedDate || '—'}</td>
      <td>${bookingCount}</td>
      <td>${statusBadge(c.status || 'active')}</td>
      <td><button class="btn btn-sm btn-secondary" onclick="showToast('বিস্তারিত তথ্য শীঘ্রই আসছে', 'info')">বিবরণ</button></td>
    </tr>`;
  }).join('');
}

function renderWorkers() {
  const workers = JSON.parse(localStorage.getItem('approvedWorkers') || '[]');
  const tbody = document.querySelector('#workTable tbody');
  if (!tbody) return;
  
  if (workers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted)">কোনো কর্মী পাওয়া যায়নি</td></tr>';
    return;
  }
  
  tbody.innerHTML = workers.map(w => {
    const ratingObj = getWorkerRating(w.workerId);
    return `<tr>
      <td>${w.name}</td>
      <td>${w.workType || '—'}</td>
      <td>${w.exp ? w.exp + ' বছর' : '—'}</td>
      <td>${ratingObj.avg > 0 ? '⭐ ' + ratingObj.avg : '—'}</td>
      <td>95%</td>
      <td><span class="badge badge-green">60%</span></td>
      <td>${statusBadge(w.status || 'active')}</td>
      <td><button class="btn btn-sm btn-secondary" onclick="showToast('বিস্তারিত তথ্য শীঘ্রই আসছে', 'info')">বিবরণ</button></td>
    </tr>`;
  }).join('');
}
"""

html = html.replace('function searchTable(tableId, q) {', render_funcs + '\nfunction searchTable(tableId, q) {')

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)
    
print("Successfully injected dynamic Admin renderers.")
