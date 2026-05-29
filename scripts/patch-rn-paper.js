/**
 * Postinstall patch for packages that ship TypeScript source via the
 * "react-native" or "source" fields in package.json.
 *
 * Expo SDK 53 / Metro 0.82 resolves modules using resolverMainFields:
 * ["react-native","browser","main"]. Packages that point "react-native"
 * to .ts/.tsx source files cause SyntaxErrors because Metro cannot parse
 * raw TypeScript. This script redirects those fields to compiled JS output.
 */
const fs = require('fs');
const path = require('path');

const nmDir = path.resolve(__dirname, '../node_modules');
let patched = 0;

function patchPkg(pkgDir) {
  const pkgJson = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJson)) return;
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf8')); } catch (e) { return; }

  const rn = pkg['react-native'];
  const src = pkg['source'];
  const mainField = pkg['main'];
  let changed = false;

  if (rn && typeof rn === 'string' && (rn.endsWith('.ts') || rn.endsWith('.tsx'))) {
    if (mainField) { pkg['react-native'] = mainField; }
    else { delete pkg['react-native']; }
    changed = true;
  }
  if (src && typeof src === 'string' && (src.endsWith('.ts') || src.endsWith('.tsx'))) {
    delete pkg['source'];
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pkgJson, JSON.stringify(pkg, null, 2));
    console.log('[patch-ts-source] ' + (pkg.name || pkgDir));
    patched++;
  }
}

if (!fs.existsSync(nmDir)) {
  console.log('[patch-ts-source] node_modules not found, skipping.');
  process.exit(0);
}

for (const d of fs.readdirSync(nmDir)) {
  const fullDir = path.join(nmDir, d);
  try {
    if (d.startsWith('@') && fs.statSync(fullDir).isDirectory()) {
      for (const sub of fs.readdirSync(fullDir)) {
        patchPkg(path.join(fullDir, sub));
      }
    } else {
      patchPkg(fullDir);
    }
  } catch (e) {}
}

console.log('[patch-ts-source] Done. Patched ' + patched + ' package(s).');

