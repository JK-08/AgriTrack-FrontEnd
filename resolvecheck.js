const fs = require('fs');
const path = require('path');

const EXTS = ['.js', '.jsx', '.ts', '.tsx'];

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith('.')) return 'PACKAGE'; // node_modules, checked separately
  const base = path.resolve(path.dirname(fromFile), importPath);
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of EXTS) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
    for (const ext of EXTS) {
      if (fs.existsSync(path.join(base, 'index' + ext))) return path.join(base, 'index' + ext);
    }
  }
  return null;
}

const files = process.argv.slice(2);
let hadError = false;
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  const importRe = /import\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(code))) {
    const imp = m[1];
    const resolved = resolveImport(f, imp);
    if (resolved === null) {
      hadError = true;
      console.log('MISSING', f, '->', imp);
    }
  }
}
if (!hadError) console.log('ALL IMPORTS RESOLVE');
process.exit(hadError ? 1 : 0);
