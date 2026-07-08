const fs = require('fs');
const parser = require('@babel/parser');
const files = process.argv.slice(2);
let hadError = false;
for (const f of files) {
  try {
    const code = fs.readFileSync(f, 'utf8');
    parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
    console.log('OK  ', f);
  } catch (e) {
    hadError = true;
    console.log('FAIL', f, '-', e.message);
  }
}
process.exit(hadError ? 1 : 0);
