import os

filepath = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# 1. Update Admin Notification Bell and add the panel
# Find the notification button
notif_btn_old = '<button class="notification-btn" onclick="showToast(getTranslation(\'msg_notif_new\'),\'info\')"><span class="notif-dot"></span> </button>'
notif_btn_new = """<div style="position:relative">
          <button class="notification-btn" id="adminNotifBtn" onclick="toggleAdminNotifs()">
            <span class="notif-dot" id="adminNotifDot" style="display:none"></span>
          </button>
          <div class="notification-panel" id="adminNotifPanel" style="display:none;position:absolute;top:100%;right:0;width:320px;background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:1000;margin-top:10px;padding:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border)">
              <span style="font-weight:700;font-size:14px">বিজ্ঞপ্তি</span>
              <button onclick="markAllRead(); renderAdminNotifs();" style="border:none;background:none;color:var(--primary);font-size:11px;cursor:pointer">সব পড়া হয়েছে</button>
            </div>
            <div id="adminNotifList" style="max-height:300px;overflow-y:auto">
              <!-- Injected by JS -->
            </div>
          </div>
        </div>"""

html = html.replace(notif_btn_old, notif_btn_new)

# 2. Add Notification functions to JS
admin_notif_js = """
function renderAdminNotifs() {
  const cnt = unreadCount();
  const dot = document.getElementById('adminNotifDot');
  if (dot) dot.style.display = cnt > 0 ? '' : 'none';
  
  const list = getNotifications().slice(0, 15);
  const el = document.getElementById('adminNotifList');
  if (el) {
    el.innerHTML = list.length ? list.map(n => `
      <div style="padding:10px 12px;border-radius:8px;margin-bottom:4px;background:${n.read ? 'transparent' : 'rgba(26,86,219,0.05)'};font-size:13px">
        <div style="color:var(--text)">${n.message}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${new Date(n.time).toLocaleString('bn-IN')}</div>
      </div>`).join('') :
      '<div style="text-align:center;color:var(--text-muted);padding:20px">কোনো বিজ্ঞপ্তি নেই</div>';
  }
}

function toggleAdminNotifs() {
  const p = document.getElementById('adminNotifPanel');
  if (!p) return;
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
  if (p.style.display === 'block') {
    markAllRead();
    renderAdminNotifs();
  }
}

// Close on outside click
document.addEventListener('click', e => {
  const p = document.getElementById('adminNotifPanel');
  const b = document.getElementById('adminNotifBtn');
  if (p && b && !p.contains(e.target) && !b.contains(e.target)) p.style.display = 'none';
});
"""

html = html.replace('function renderReviews() {', admin_notif_js + '\nfunction renderReviews() {')

# 3. Add renderAdminNotifs() to DOMContentLoaded
html = html.replace('renderReviews();', 'renderReviews();\n  renderAdminNotifs();')

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)

print("Admin dashboard updated with dynamic Notifications list.")
