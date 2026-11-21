// TeamKit – SPEKTRON-LOOK v1 byte-gleich mit BerichtKit (Audit 2026-11 Lauf 5, E4 #3). Vorher prüfte das niemand.
// node tests/look.cjs   (liegt ../berichtkit daneben, wird verglichen; mit TEAMKIT_LOOK_PFLICHT=1 muss es daneben liegen)
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const look = t => { const a = t.indexOf('/* ===== SPEKTRON-LOOK v'), e = t.indexOf('/* ===== Ende SPEKTRON-LOOK v'); return a < 0 || e < 0 ? null : t.slice(a, e); };
const eigen = look(html);
assert.ok(eigen && eigen.startsWith('/* ===== SPEKTRON-LOOK v1'), 'Look-Block v1 in index.html');
assert.equal(html.split('/* ===== SPEKTRON-LOOK v').length, 2, 'Look-Block genau einmal');
const bk = path.resolve(process.env.BERICHTKIT_DIR || path.join(ROOT, '..', 'berichtkit'), 'index.html');
if (fs.existsSync(bk)){
  assert.equal(eigen, look(fs.readFileSync(bk, 'utf8')), 'SPEKTRON-LOOK nicht byte-gleich mit BerichtKit');
  console.log('OK SPEKTRON-LOOK byte-gleich mit BerichtKit');
} else {
  assert.ok(process.env.TEAMKIT_LOOK_PFLICHT !== '1', `${bk} fehlt – Look nicht verglichen (TEAMKIT_LOOK_PFLICHT=1)`);
  console.log('SKIP SPEKTRON-LOOK: ../berichtkit fehlt');
}
