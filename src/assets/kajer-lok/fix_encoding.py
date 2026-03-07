import json
import re

with open('c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/i18n.js', 'r', encoding='utf8') as f:
    text = f.read()

bn_block = re.search(r'bn:\s*\{([^}]*)\}\s*,[ \n\r\t]*en:', text)
bn_dict = {}

if bn_block:
    lines = bn_block.group(1).split('\n')
    for line in lines:
        match = re.search(r"^\s*([a-zA-Z0-9_]+)\s*:\s*['\"](.*?)['\"]\s*,?", line)
        if match:
            bn_dict[match.group(1)] = match.group(2)

print(f'Found {len(bn_dict)} translations in i18n.js')

files = [
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html',
    'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/customer-dashboard.js'
]

def replace_translation(match):
    key = match.group(1)
    if key in bn_dict:
        return f'data-i18n="{key}">{bn_dict[key]}</'
    return match.group(0)

def replace_buttons(text):
    text = re.sub(r'\'hi\'\)">\?\?+<', "'hi')\">হিন্দি<", text)
    text = re.sub(r'\'bn\'\)">\?\?+<', "'bn')\">বাংলা<", text)
    text = re.sub(r'\'en\'\)">\?\?+<', "'en')\">English<", text)
    text = re.sub(r'>\?\?+ / Select Language / \?\?+<', '>ভাষা নির্বাচন করুন / Select Language / भाषा चुनें<', text)
    return text

for filepath in files:
    with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
        html = f.read()
    
    updated_html = re.sub(r'data-i18n="([^"]+)">[^<]*\??[^<]*</', replace_translation, html)
    updated_html = replace_buttons(updated_html)
    
    with open(filepath, 'w', encoding='utf8') as f:
        f.write(updated_html)

print('Files processed successfully.')
