const fs = require('fs');
const html = fs.readFileSync('dashboard-admin.html', 'utf8');
let js = fs.readFileSync('js/i18n.js', 'utf8');

// Find all data-i18n keys
const regex = /data-i18n="([^"]+)"/g;
const keys = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
    keys.add(match[1]);
}
const allKeys = Array.from(keys);

// English fallback generator
function generateEnFallback(key) {
    return key.replace(/^(table|nav|setting_cat|label)_/, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Check which keys are missing in EN, HI, BN blocks
const bnHalf = js.substring(js.indexOf('bn:'), js.indexOf('en:'));
const enHalf = js.substring(js.indexOf('en: {'), js.indexOf('hi: {'));
const hiHalf = js.substring(js.indexOf('hi: {'), js.length);

const missingBn = allKeys.filter(k => !bnHalf.includes(k + ':'));
const missingEn = allKeys.filter(k => !enHalf.includes(k + ':'));
const missingHi = allKeys.filter(k => !hiHalf.includes(k + ':'));

console.log('Missing in BN:', missingBn.length);
console.log('Missing in EN:', missingEn.length);
console.log('Missing in HI:', missingHi.length);

if (missingEn.length > 0) {
    const enAdditions = missingEn.map(k => `        ${k}: '${generateEnFallback(k)}',`).join('\\n');
    console.log('Adding to EN:', enAdditions);
    // Insert before "    }," at the end of en block
    const enEnd = js.indexOf('    },', js.indexOf('en: {'));
    js = js.substring(0, enEnd) + '\\n        // Admin portal extracted\\n' + enAdditions + '\\n' + js.substring(enEnd);
}

if (missingHi.length > 0) {
    const hiAdditions = missingHi.map(k => `        ${k}: '${generateEnFallback(k)}',`).join('\\n');
    const hiEnd = js.lastIndexOf('    }');
    js = js.substring(0, hiEnd) + '\\n        // Admin portal extracted\\n' + hiAdditions + '\\n' + js.substring(hiEnd);
}

if (missingBn.length > 0) {
    const bnAdditions = missingBn.map(k => `        ${k}: '${generateEnFallback(k)}',`).join('\\n');
    const bnEnd = js.indexOf('    },', js.indexOf('bn: {'));
    js = js.substring(0, bnEnd) + '\\n        // Admin portal extracted\\n' + bnAdditions + '\\n' + js.substring(bnEnd);
}

fs.writeFileSync('js/i18n.js', js);
console.log('Updated js/i18n.js');
