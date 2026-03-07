import json
import re

files_to_fix = [
    ('c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html', {
        '<h3\nstyle="color:var(--primary);margin:8px 0    \n4px;font-size:18px;font-weight:800">???????': '<h3\nstyle="color:var(--primary);margin:8px 0    \n4px;font-size:18px;font-weight:800">পরিচয়পত্র',
        '>????? ????? ???????? ????? ??????': '>ডকুমেন্ট সম্পূর্ণ লোড হতে কিছুটা সময় লাগতে পারে',
        '???????? ????????? ?? ??????? ??? ?????': 'দয়া করে চেক করুন যে সব তথ্য সঠিক দেওয়া আছে',
        '??????? ???? ???? SMS-? ?????? ????</p>': 'অ্যাপ্রুভ করার সাথে সাথে ইউজারের কাছে SMS যাবে</p>'
    }),
    ('c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html', {
        '<a href="login-customer.html" class="btn btn-primary" style="margin-top:20px">???? ???? ???</a>': '<a href="login-customer.html" class="btn btn-primary" style="margin-top:20px">লগইন পেজে যান</a>',
        '? ?? ????? ???????': 'আপনার অ্যাকাউন্ট ভেরিফিকেশনের জন্য',
        '<strong styl': '<strong styl',
        '<h2 style="color:var(--text);font-size:22': '<h2 style="color:var(--text);font-size:22',
        "showToast('?????? ???????????", "showToast('পাসওয়ার্ড মিলে নি",
        "showToast('??? ? ???? ?????", "showToast('সব তথ্য দিন"
    }),
    ('c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html', {
        '<a href="login-worker.html" class="btn btn-primary" style="margin-top:20px">???? ???? ???</a>': '<a href="login-worker.html" class="btn btn-primary" style="margin-top:20px">লগইন পেজে যান</a>',
        '? ????????????': 'আপনার আবেদনটি',
        '? ?? ????? ???????': 'আপনার অ্যাকাউন্ট ভেরিফিকেশনের জন্য',
        'showToast(\'?? ????? ???????': "showToast('সব তথ্য পূরণ করুন"
    })
]

for filepath, replacements in files_to_fix:
    with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
        content = f.read()
        
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    # Catch any remaining >????< or > ????? < formats
    content = re.sub(r'>(?:\s|\n|\r)*\?+(?:\s|\n|\r)*<', '><', content)
    content = re.sub(r'>(?:\s|\n|\r)*\?+(?:\s|\n|\r)+\?+(?:\s|\n|\r)*<', '><', content)
        
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(content)

print('Cleaned remaining deep question marks')
