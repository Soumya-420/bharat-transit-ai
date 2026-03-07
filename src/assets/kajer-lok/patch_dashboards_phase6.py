import os

def patch_customer_dash():
    path_js = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\js\customer-dashboard.js'
    with open(path_js, 'r', encoding='utf8') as f: content_js = f.read()
    
    # Add Receipt button
    content_js = content_js.replace('          <button class="btn btn-sm btn-outline" onclick="doRequestReplacement(\'${b.bookingId}\')"',
                                  '          <button class="btn btn-sm btn-secondary" onclick="printReceipt(\'${b.bookingId}\')">📄 রসিদ</button>\n          <button class="btn btn-sm btn-outline" onclick="doRequestReplacement(\'${b.bookingId}\')"')
    
    content_js = content_js.replace('`<button class="btn btn-sm btn-primary" onclick="openRateModal(\'${b.bookingId}\',\'${b.workerName || \'\'}\')">⭐ রেট করুন</button>`',
                                  '`<button class="btn btn-sm btn-secondary" onclick="printReceipt(\'${b.bookingId}\')">📄 রসিদ</button> <button class="btn btn-sm btn-primary" onclick="openRateModal(\'${b.bookingId}\',\'${b.workerName || \'\'}\')">⭐ রেট করুন</button>`')

    with open(path_js, 'w', encoding='utf8') as f: f.write(content_js)
    
    path_html = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-customer.html'
    with open(path_html, 'r', encoding='utf8') as f: content_html = f.read()

    # Add Password Button to sidebar
    sidebar_user = """<div class="sidebar-user">
        <div class="su-avatar">গ</div>
        <div>
          <div class="su-name">গ্রাহক</div>
          <div class="su-role">ID: </div>
          <button onclick="openModal('pwdModal')" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;padding:0;margin-top:2px">পাসওয়ার্ড পরিবর্তন</button>
        </div>"""
    content_html = content_html.replace('<div class="sidebar-user">\n        <div class="su-avatar">গ</div>\n        <div>\n          <div class="su-name">গ্রাহক</div>\n          <div class="su-role">ID: </div>\n        </div>', sidebar_user)

    # Add Password Modal
    pwd_modal = """
    <!-- PW MODAL -->
    <div class="modal-overlay" id="pwdModal">
        <div class="modal-card" style="max-width:400px">
            <div class="modal-header">
                <span class="modal-title">পাসওয়ার্ড পরিবর্তন</span>
                <button class="modal-close" onclick="closeModal('pwdModal')">✕</button>
            </div>
            <div class="form-group">
                <label>বর্তমান পাসওয়ার্ড</label>
                <input type="password" class="form-control" id="oldPwd">
            </div>
            <div class="form-group">
                <label>নতুন পাসওয়ার্ড</label>
                <input type="password" class="form-control" id="newPwd">
            </div>
            <button class="btn btn-primary btn-full" onclick="doChangePwd('customer')">পরিবর্তন করুন</button>
        </div>
    </div>
    <script>
    function doChangePwd(type) {
        const o = document.getElementById('oldPwd').value;
        const n = document.getElementById('newPwd').value;
        if(!o || !n) { showToast('সব তথ্য দিন', 'error'); return; }
        if(typeof changePassword !== 'function') { showToast('Error: changePassword not found', 'error'); return; }
        const res = changePassword(type, o, n);
        if(res.success) {
            showToast(res.msg, 'success');
            closeModal('pwdModal');
        } else {
            showToast(res.msg, 'error');
        }
    }
    </script>
    """
    content_html = content_html.replace('</body>', pwd_modal + '\n</body>')
    with open(path_html, 'w', encoding='utf8') as f: f.write(content_html)
    print("Customer Dash patched.")

def patch_worker_dash():
    path = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-worker.html'
    with open(path, 'r', encoding='utf8', errors='ignore') as f: content = f.read()
    
    # Add Receipt button
    content = content.replace('<td>${statusBadge(b.status)}</td>', 
                            '<td>${statusBadge(b.status)}</td>\n              <td><button class="btn btn-sm btn-secondary" onclick="printReceipt(\'${b.bookingId}\')">📄 রসিদ</button></td>')
    
    # Add Password Button
    sidebar_user = """<div class="sidebar-user">
        <div class="su-avatar" id="wSideAvatar">?</div>
        <div>
          <div class="su-name" id="wSideName">?????</div>
          <div class="su-role" id="wSideRole">?????</div>
          <button onclick="openModal('pwdModal')" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;padding:0;margin-top:2px">পাসওয়ার্ড পরিবর্তন</button>
        </div>"""
    content = content.replace('<div class="sidebar-user">\n        <div class="su-avatar" id="wSideAvatar">?</div>\n        <div>\n          <div class="su-name" id="wSideName">?????</div>\n          <div class="su-role" id="wSideRole">?????</div>\n        </div>', sidebar_user)

    # Add Password Modal
    pwd_modal = """
    <!-- PW MODAL -->
    <div class="modal-overlay" id="pwdModal">
        <div class="modal-card" style="max-width:400px">
            <div class="modal-header">
                <span class="modal-title">পাসওয়ার্ড পরিবর্তন</span>
                <button class="modal-close" onclick="closeModal('pwdModal')">✕</button>
            </div>
            <div class="form-group">
                <label>বর্তমান পাসওয়ার্ড</label>
                <input type="password" class="form-control" id="oldPwd">
            </div>
            <div class="form-group">
                <label>নতুন পাসওয়ার্ড</label>
                <input type="password" class="form-control" id="newPwd">
            </div>
            <button class="btn btn-primary btn-full" onclick="doChangePwd('worker')">পরিবর্তন করুন</button>
        </div>
    </div>
    <script>
    function doChangePwd(type) {
        const o = document.getElementById('oldPwd').value;
        const n = document.getElementById('newPwd').value;
        if(!o || !n) { showToast('সব তথ্য দিন', 'error'); return; }
        const res = changePassword(type, o, n);
        if(res.success) {
            showToast(res.msg, 'success');
            closeModal('pwdModal');
        } else {
            showToast(res.msg, 'error');
        }
    }
    </script>
    """
    content = content.replace('</body>', pwd_modal + '\n</body>')
    with open(path, 'w', encoding='utf8') as f: f.write(content)
    print("Worker Dash patched.")

def patch_admin_dash():
    path = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok\dashboard-admin.html'
    with open(path, 'r', encoding='utf8', errors='ignore') as f: content = f.read()

    # Add Password Modal
    pwd_modal = """
    <!-- PW MODAL -->
    <div id="pwdModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;align-items:center;justify-content:center;">
        <div style="background:#fff;border-radius:16px;padding:32px;max-width:400px;width:92%;border:1px solid var(--border);position:relative;">
            <button onclick="document.getElementById('pwdModal').style.display='none'" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:20px;cursor:pointer">✕</button>
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
    <script>
    function doChangePwd(type) {
        const o = document.getElementById('oldPwd').value;
        const n = document.getElementById('newPwd').value;
        if(!o || !n) { showToast('সব তথ্য দিন', 'error'); return; }
        const res = changePassword(type, o, n);
        if(res.success) {
            showToast(res.msg, 'success');
            document.getElementById('pwdModal').style.display = 'none';
        } else {
            showToast(res.msg, 'error');
        }
    }
    </script>
    """
    content = content.replace('</body>', pwd_modal + '\n</body>')
    
    # Add link to sidebar
    content = content.replace('<div class="su-role" data-i18n="admin_role">সুপার অ্যাডমিন</div>', 
                             '<div class="su-role" data-i18n="admin_role">সুপার অ্যাডমিন</div>\n          <button onclick="document.getElementById(\'pwdModal\').style.display=\'flex\'" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;padding:0;margin-top:2px">পাসওয়ার্ড পরিবর্তন</button>')

    with open(path, 'w', encoding='utf8') as f: f.write(content)
    print("Admin Dash patched.")

patch_customer_dash()
patch_worker_dash()
patch_admin_dash()
