const fs = require('fs');
const path = require('path');
const dir = '.';

function walk(d) {
    let results = [];
    const list = fs.readdirSync(d);
    for (let file of list) {
        file = path.join(d, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('.git') && !file.includes('.gemini') && !file.includes('node_modules')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    }
    return results;
}

const files = walk(dir);
let changedCount = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = content.replace(/₹/g, '₹');
    content = content.replace(/₹/g, '₹');
    content = content.replace(/'Rs': '₹'/g, '\'Rs\': \'₹\'');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
        changedCount++;
    }
}
console.log('Total files updated: ' + changedCount);
