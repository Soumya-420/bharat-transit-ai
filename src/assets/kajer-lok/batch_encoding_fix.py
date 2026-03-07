import os
import re

directory = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok'

files_to_fix = [
    'login-admin.html',
    'login-customer.html',
    'login-worker.html',
    'register-worker.html',
    'register-customer.html',
    'privacy.html'
]

# Common lang bar fix
for filename in files_to_fix:
    filepath = os.path.join(directory, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
            html = f.read()
        
        # Language bar msg
        html = html.replace('<span class="lang-msg" id="langMsg">?? ???? ???????? ???? / Select Language / ???? ?????</span>',
                            '<span class="lang-msg" id="langMsg" data-i18n="lang_selection_title">🌐 ভাষা নির্বাচন করুন / Select Language / भाषा चुनें</span>')
        
        # Specific login button fixes (button and links)
        html = html.replace('data-i18n="btn_login">????? ????</button>', 'data-i18n="btn_login">লগইন করুন</button>')
        html = html.replace("onclick=\"showToast('???????????? ???? ??????? ????????? ????')\">???????? ???? ?????</a>", "onclick=\"showToast('অ্যাডমিনের সাথে যোগাযোগ করুন')\">পাসওয়ার্ড ভুলে গেছেন?</a>")
        html = html.replace("onclick=\"showToast('??????? ???? ??????????? ???? ??????? ????')\">???????? ???? ?????</a>", "onclick=\"showToast('অ্যাডমিনের সাথে যোগাযোগ করুন')\">পাসওয়ার্ড ভুলে গেছেন?</a>")
        html = html.replace('placeholder=" KL-W-1001"', 'placeholder="যেমন: KL-W-1001"')
        html = html.replace('placeholder=" KL-A-1001"', 'placeholder="যেমন: admin"')
        html = html.replace('placeholder=" +91..."', 'placeholder="যেমন: +91..."')

        # Title tags that might be broken
        html = re.sub(r'<title>\?\?.*?</title>', '<title>কাজের লোক</title>', html)

        with open(filepath, 'w', encoding='utf8') as f:
            f.write(html)
            
# Fix i18n logic mappings
i18n_path = os.path.join(directory, 'js', 'i18n.js')
if os.path.exists(i18n_path):
    with open(i18n_path, 'r', encoding='utf8', errors='ignore') as f:
        js = f.read()

    js = js.replace('title_worker_reg: "????? ???????",', 'title_worker_reg: "কর্মী নিবন্ধন",')
    js = js.replace('title_admin_login: "???????? ?????",', 'title_admin_login: "অ্যাডমিন লগইন",')
    js = js.replace('title_privacy: "??????? ????",', 'title_privacy: "গোপনীয়তা নীতি",')
    js = js.replace('btn_login: "????? ????",', 'btn_login: "লগইন করুন",')
    js = js.replace('btn_logout: "** ?? ??? ????",', 'btn_logout: "লগ আউট",')
    js = js.replace('btn_add_document: "** ???????? ????? ????",', 'btn_add_document: "ডকুমেন্ট যোগ করুন",')
    js = js.replace('nav_overview: "??",', 'nav_overview: "ওভারভিউ",')
    js = js.replace('nav_update_status: "??",', 'nav_update_status: "অ্যাভেইল্যাবিলিটি আপডেট",')
    js = js.replace('nav_schedule: "??",', 'nav_schedule: "কাজের সময়সূচী",')
    js = js.replace('admin_role: "????? ????????",', 'admin_role: "সুপার অ্যাডমিন",')
    js = js.replace('table_fee_title: "????? ?????",', 'table_fee_title: "পরিষেবা মূল্য",')
    js = js.replace('table_id_proof: "?????",', 'table_id_proof: "পরিচয়পত্র",')
    js = js.replace('ph_admin_username: "??: admin | ???????: admin123",', 'ph_admin_username: "যেমন: admin | ডিফল্ট: admin123",')
    js = js.replace('ph_admin_pwd: "??????: admin123",', 'ph_admin_pwd: "মাস্টার পাসওয়ার্ড: admin123",')

    with open(i18n_path, 'w', encoding='utf8') as f:
        f.write(js)

print("Batch fixes completed successfully across UI headers and mapping js.")
