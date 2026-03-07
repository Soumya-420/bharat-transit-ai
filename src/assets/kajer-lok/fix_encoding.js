const fs = require('fs');

// Create a basic replica of the translation object from i18n.js
// We use regex to extract the 'bn' block
const i18nContent = fs.readFileSync('c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/i18n.js', 'utf8');
const bnMatch = i18nContent.match(/bn:\s*\{([^]*?)\}\s*,\s*en:/);
let bnDict = {};

if (bnMatch) {
    const rawLines = bnMatch[1].split('\n');
    rawLines.forEach(line => {
        const parts = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*['"](.*?)['"]\s*,?/);
        if (parts && parts.length === 3) {
            bnDict[parts[1]] = parts[2];
        }
    });
}

const files = [
  'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-admin.html',
  'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/dashboard-worker.html',
  'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-customer.html',
  'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/register-worker.html',
  'c:/Users/soumy/.gemini/antigravity/scratch/kajer-lok/js/customer-dashboard.js'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // For HTML files, we can use regex to find data-i18n="KEY">????< and replace the ???? with bnDict[KEY]
    content = content.replace(/data-i18n="([^"]+)">([^<]*\?+[^<]*)<\//g, (match, key, qMarks) => {
        if (bnDict[key]) {
            return data-i18n="\">\</;
        }
        return match;
    });

    // Handle button text for languages
    content = content.replace(/'hi'\)">\?\?+<\//g, "'hi')\">হিন্দি</");
    content = content.replace(/'bn'\)">\?\?+<\//g, "'bn')\">বাংলা</");
    content = content.replace(/'en'\)">\?\?+<\//g, "'en')\">English</");
    content = content.replace(/>\?\?+ \/ Select Language \/ \?\?+</g, ">ভাষা নির্বাচন করুন / Select Language / भाषा चुनें<");
    
    // Write-back
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Restored text where data-i18n tags were present.');
