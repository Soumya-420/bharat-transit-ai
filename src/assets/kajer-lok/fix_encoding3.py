import re

files = [
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/customer-dashboard.js'
]

replacements = {
    'title="?????"': 'title="লগ আউট"',
    '<td>???? ????</td>': '<td>নাম নেই</td>',
    '<td>?????? ????</td>': '<td>নাম নেই</td>',
    '<td>????? ???</td>': '<td>মাসিক</td>',
    '<h3 style="font-size:18px;color:var(--text);margin-bottom:8px">???? ???!</h3>': '<h3 style="font-size:18px;color:var(--text);margin-bottom:8px">স্বাগতম!</h3>',
    '<p style="font-size:13px;color:var(--text-muted);font-weight:500">????? ?????????</p>': '<p style="font-size:13px;color:var(--text-muted);font-weight:500">অ্যাডমিন ড্যাশবোর্ড</p>',
    '<td>???? ???????</td>': '<td>নাম নেই</td>',
    '<td>???? ???</td>': '<td>অজানা</td>',
    '<h3 id="docViewTitle" style="color:var(--text);margin-bottom:16px;padding-right:32px">?? ??????????</h3>': '<h3 id="docViewTitle" style="color:var(--text);margin-bottom:16px;padding-right:32px">পরিচয়পত্র</h3>'
}

for filepath in files:
    with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
        html = f.read()
    
    for k, v in replacements.items():
        html = html.replace(k, v)
        
    # Catch any remaining >????< or > ????? < formats
    html = re.sub(r'>\s*\?+\s*<', '><', html)
    html = re.sub(r'>\s*\?+\s+\?+\s*<', '>নাম নেই<', html)
    
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(html)

print('Cleaned up remaining question marks')
