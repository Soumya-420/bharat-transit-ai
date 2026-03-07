import json
import re

files_to_fix = [
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/customer-dashboard.js'
]

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
        html = f.read()

    # Manually replace exact remaining strings spotted in grep output
    html = html.replace('<h3\nstyle="color:var(--primary);margin:8px 0    \n4px;font-size:18px;font-weight:800">???????', '<h3\nstyle="color:var(--primary);margin:8px 0    \n4px;font-size:18px;font-weight:800">পরিচয়পত্র')
    html = html.replace(';text-align:center">??? ?????...</p>', ';text-align:center">তথ্য লোড হচ্ছে...</p>')
    html = html.replace('data-i18n="label_comm_rate">???????????     \n????? (%)</label>', 'data-i18n="label_comm_rate">কমিশন (%)</label>')
    html = html.replace('<p style="color:var(--text-muted) \n              style="margin-top:16px">??    \n??? ????</button>', '<p style="color:var(--text-muted) \n              style="margin-top:16px">কোনো তথ্য নেই</button>')
    
    # Generic replacement
    html = re.sub(r'>(?:\s|\n)*\?+(?:\s|\n)*<', '> <', html)
    html = re.sub(r'>(?:\s|\n)*\?+(?:\s|\n)+\?+(?:\s|\n)*<', '> <', html)
    html = re.sub(r'"\?\?+"', '""', html)
    
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(html)

for f in files_to_fix:
    clean_file(f)

print("Final cleanup finished")
