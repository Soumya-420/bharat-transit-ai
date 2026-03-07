import re

filepath = 'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html'

with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
    html = f.read()

# Normalize spacing to make replacements easier
html = re.sub(r'\s+', ' ', html)

replacements = {
    '<h3 style="color:var(--primary);margin:8px 0 4px;font-size:18px;font-weight:800">???????': '<h3 style="color:var(--primary);margin:8px 0 4px;font-size:18px;font-weight:800">পরিচয়পত্র',
    '<h3 style="margin-top:16px">?? ??? ????</button>': '<h3 style="margin-top:16px">লগ আউট</button>',
    '<p style="font-size:13px;color:var(--text-muted);font-weight:500">????? ???? ???!</h3>': '<p style="font-size:13px;color:var(--text-muted);font-weight:500">অ্যাডমিন ড্যাশবোর্ড!</h3>',
    '????????????? ?????? ????</p>': 'অ্যাডমিন ড্যাশবোর্ড</p>',
    '<span class="card-title">?? ?????? ??????? ???????</span>': '<span class="card-title">নতুন গ্রাহক</span>',
    '<span class="card-title">?? ????? ??????? ???????</span>': '<span class="card-title">নতুন কর্মী</span>',
    '<label data-i18n="label_comm_rate">??????????? ????? (%)</label>': '<label data-i18n="label_comm_rate">কমিশন (%)</label>',
    '<label data-i18n="label_min_fee">??-?????????? ?? (Rs)</label>': '<label data-i18n="label_min_fee">ন্যূনতম ফি (Rs)</label>',
    '<label data-i18n="label_emergency_contact">????? ????????? ?????</label>': '<label data-i18n="label_emergency_contact">জরুরী যোগাযোগ</label>',
    '<h3>?? ??? ????</button>': '<h3>লগ আউট</button>',
    'style="margin-top:16px">?? ??? ????</button>': 'style="margin-top:16px">লগ আউট</button>',
    '<h3 style="font-size:18px;color:var(--text);margin-bottom:8px">???? ???!</h3>': '<h3 style="font-size:18px;color:var(--text);margin-bottom:8px">স্বাগতম!</h3>'
}

for k, v in replacements.items():
    html = html.replace(k, v)
    
# Clean any leftover exact patterns
html = re.sub(r'>\s*\?+\s*<', '> <', html)
html = re.sub(r'\?\?+', '', html)

with open(filepath, 'w', encoding='utf8') as f:
    f.write(html)

print("Applied final targeted replacements with whitespace normalization.")
