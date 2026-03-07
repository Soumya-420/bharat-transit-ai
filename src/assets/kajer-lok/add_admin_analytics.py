import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# 1. Add script tag
html = html.replace('<script src="js/auth.js"></script>', 
                    '<script src="js/auth.js"></script>\n<script src="js/analytics.js"></script>')

# 2. Add Sidebar Navigation for Leaderboard
nav_item_leaderboard = """<button class="nav-item" data-page="pa-leaderboard">
        <span class="nav-icon"></span>
        <span class="nav-label" data-i18n="nav_leaderboard">লিডারবোর্ড</span>
      </button>"""

html = html.replace('<button class="nav-item" data-page="pa-reviews">', 
                    nav_item_leaderboard + '\n      <button class="nav-item" data-page="pa-reviews">')

# 3. Add Leaderboard Page Content
leaderboard_page = """
    <!-- LEADERBOARD -->
    <div class="dash-page" id="pa-leaderboard">
      <div class="card">
        <div class="card-header"><span class="card-title">শীর্ষ কর্মী লিডারবোর্ড (Top 10)</span></div>
        <div class="table-wrap">
          <table id="leaderboardTable">
            <thead>
              <tr>
                <th>র‍্যাঙ্ক</th>
                <th>নাম</th>
                <th>আইডি</th>
                <th>রেটিং</th>
                <th>মোট কাজ</th>
                <th>পারফরম্যান্স স্কোর</th>
              </tr>
            </thead>
            <tbody>
              <!-- Injected by JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
"""
html = html.replace('<!-- REVIEWS -->', leaderboard_page + '\n    <!-- REVIEWS -->')

# 4. Add Export Buttons to Customer and Worker tables
html = html.replace('placeholder="Search..." onkeyup="searchTable(\'custTable\',this.value)" style="max-width:240px;padding:8px 14px" />',
                    'placeholder="Search..." onkeyup="searchTable(\'custTable\',this.value)" style="max-width:240px;padding:8px 14px" />\n          <button class="btn btn-sm btn-outline" onclick="doExport(\'customers\')">📥 CSV এক্সপোর্ট</button>')

html = html.replace('placeholder="Search..." onkeyup="searchTable(\'workTable\',this.value)" style="max-width:240px;padding:8px 14px" />',
                    'placeholder="Search..." onkeyup="searchTable(\'workTable\',this.value)" style="max-width:240px;padding:8px 14px" />\n          <button class="btn btn-sm btn-outline" onclick="doExport(\'workers\')">📥 CSV এক্সপোর্ট</button>')

# 5. Add Mini-Chart to Overview
chart_html = """
        <div class="card" style="grid-column: 1 / -1; margin-bottom: 24px;">
          <div class="card-header"><span class="card-title">আয় ও লেনদেন ট্রেন্ড (শেষ ৬ মাস)</span></div>
          <div style="padding: 24px;">
            <div id="revenueChart" style="min-height: 150px; background: rgba(255,255,255,0.02); border-radius: 12px; padding: 20px;"></div>
          </div>
        </div>
"""
html = html.replace('<div class="dash-page active" id="pa-home">\n <div class="stats-row">',
                    '<div class="dash-page active" id="pa-home">\n' + chart_html + '\n <div class="stats-row">')

# 6. Add JS functions for rendering
analytics_render_js = """
function renderLeaderboard() {
  const top = getWorkerLeaderboard();
  const tbody = document.querySelector('#leaderboardTable tbody');
  if (!tbody) return;
  
  if (top.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">কোনো তথ্য পাওয়া যায়নি</td></tr>';
    return;
  }
  
  tbody.innerHTML = top.map((w, i) => `
    <tr>
      <td style="font-weight:700; color:var(--primary)">#${i+1}</td>
      <td>${w.name}</td>
      <td style="font-family:monospace">${w.id}</td>
      <td>⭐ ${w.rating || 0}</td>
      <td>${w.jobs}</td>
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
"""

html = html.replace('function renderAdminNotifs() {', analytics_render_js + '\nfunction renderAdminNotifs() {')

# 7. Update DOMContentLoaded
html = html.replace('renderAdminNotifs();', 'renderAdminNotifs();\n  renderAnalytics();')

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)

print("Admin dashboard updated with Analytics, Leaderboard and CSV Export.")
