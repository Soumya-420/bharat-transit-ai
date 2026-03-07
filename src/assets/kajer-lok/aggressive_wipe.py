import os
import re

directory = r'c:\Users\soumy\.gemini\antigravity\scratch\kajer-lok'

for root, dirs, files in os.walk(directory):
    # Skip any hidden/system folders just in case
    if '.git' in root or '.gemini' in root:
        continue
    for filename in files:
        if filename.endswith('.html') or filename.endswith('.js'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf8', errors='ignore') as f:
                content = f.read()
            
            if '??' not in content:
                continue
                
            original = content
            
            # Safe JS fallbacks
            content = content.replace("|| '?????'", "|| 'নাম নেই'")
            content = content.replace("|| '????'", "|| 'নেই'")
            content = content.replace("|| '???'", "|| 'নেই'")
            content = content.replace("'?? ' +", "'' +")
            
            # For HTML files, aggressive wipe of ?? sequences
            if filename.endswith('.html'):
                content = re.sub(r'\?{2,}', '', content)
            else:
                # For JS files, only wipe 3 or more ? to protect nullish coalescing ??
                content = re.sub(r'\?{3,}', '', content)
            
            if content != original:
                with open(filepath, 'w', encoding='utf8') as f:
                    f.write(content)

print("Aggressive cleaning complete.")
