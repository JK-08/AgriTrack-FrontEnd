const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const files = process.argv.slice(2);
let fail = false;
for (const f of files) {
  try {
    babel.transformFileSync(f, { cwd: process.cwd(), configFile: path.join(process.cwd(), 'babel.config.js') });
    console.log('OK  ', f);
  } catch (e) {
    fail = true;
    console.log('FAIL', f, '-', e.message.split('\n')[0]);
  }
}
process.exit(fail ? 1 : 0);
