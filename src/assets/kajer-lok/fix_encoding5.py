import json
import re

files_to_fix = [
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html'
]

def replace_common_corruptions(text):
    text = re.sub(r'placeholder="\?\?\?\? \w*.*?"', 'placeholder="লিখুন..."', text)
    text = re.sub(r"showToast\('.*?\?\?.*?',", "showToast('দয়া করে সঠিক তথ্য দিন',", text)
    text = re.sub(r'alt="\?\?\?\?\?.*?"', 'alt="লোগো"', text)
    text = re.sub(r'>\?\?\?[\?\s]*<', '>খালি<', text)
    text = re.sub(r'>\?\? ????\s*<', '>নাম নেই<', text)
    text = re.sub(r'JPG, PNG \?\?.*PDF.*?\?\?.*?', 'JPG, PNG বা PDF ফরম্যাট', text)
    text = re.sub(r'>\?\? ????<', '>ভাষা নির্বাচন করুন / Select Language / भाषा चुनें<', text)
    text = re.sub(r'id="langMsg">.*?</', 'id="langMsg">ভাষা নির্বাচন করুন / Select Language / भाषा चुनें</', text)
    text = re.sub(r'>\?\? <\w+', '><', text)
    return text

for filepath in files_to_fix:
    with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
        content = f.read()
        
    updated = replace_common_corruptions(content)
        
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(updated)

print('Cleaned remaining corrupted attributes')
