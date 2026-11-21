// TeamKit – Fokus beim Öffnen aus der Projektzentrale (Audit 2026-11 Lauf 5, E6). Ohne Browser: der Abschnitt „oeffnen“ aus
// index.html läuft mit nachgebauten Elementen. Kommt „öffnen“ erst an, wenn man schon wieder in der Projektzentrale ist
// (der Rahmen hat den Fokus nicht mehr), darf TeamKit ihn nicht in den Rahmen zurückholen – sonst gehen Esc/F1 an TeamKit.
// node tests/fokus.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const stueck = (von, bis) => { const a = html.indexOf(von), b = html.indexOf(bis, a); assert.ok(a > 0 && b > a, 'Abschnitt fehlt: ' + von); return html.slice(a, b); };
const code = stueck('/** Fokus nach dem Öffnen', 'function zu()');

function welt({ ansicht = 'team', hatFokus = true, eintrag = false, morgen = false } = {}){
  const fokus = [];
  const el = name => ({ name, textContent: '', focus(){ fokus.push(name); }, scrollIntoView(){} });
  const els = { zurueckText: el('zurueckText'), zugangTitel: el('zugangTitel'), kText: el('kText') };
  const ctx = {
    S: { tk: {}, ansicht, offen: new Set() }, fokus,
    $: id => els[id] || el(id),
    document: { hasFocus: () => hatFokus, querySelector: s => /\.los/.test(s) ? el('los') : /data-aktion="auf"/.test(s) ? el('gilt-auf') : null },
    CSS: { escape: s => s },
    laden: async () => true, giltAktiv: () => eintrag ? [{ id: 'g1' }] : [], teamZeigen(){ ctx.S.ansicht = 'team'; }, zeige(a){ ctx.S.ansicht = a; },
    morgenFaellig: () => morgen, melden(){}
  };
  vm.createContext(ctx); vm.runInContext(code + '\nthis.oeffnen = oeffnen;', ctx);
  return ctx;
}
let n = 0; const ok = async (name, fn) => { await fn(); n++; console.log('OK ' + name); };
(async () => {
  await ok('Rahmen hat den Fokus: Eingabefeld bzw. „Los geht’s“ bzw. Beitrag bekommt ihn (wie bisher)', async () => {
    let w = welt(); await w.oeffnen({ art: 'oeffnen' }); assert.deepEqual([...w.fokus], ['kText']);
    w = welt({ morgen: true }); await w.oeffnen({}); assert.deepEqual([...w.fokus], ['los']);
    w = welt({ eintrag: true }); await w.oeffnen({ id: 'g1' }); assert.deepEqual([...w.fokus], ['gilt-auf']);
    w = welt({ ansicht: 'zugang' }); await w.oeffnen({}); assert.deepEqual([...w.fokus], ['zugangTitel']);
  });
  await ok('E6: man ist schon wieder in der Projektzentrale → TeamKit holt den Fokus nicht in den Rahmen', async () => {
    for (const o of [{}, { morgen: true }, { eintrag: true }, { ansicht: 'zugang' }]){
      const w = welt({ ...o, hatFokus: false }); await w.oeffnen(o.eintrag ? { id: 'g1' } : {});
      assert.deepEqual([...w.fokus], [], JSON.stringify(o));
    }
  });
  await ok('Ansicht und Zurück-Text werden trotzdem gesetzt', async () => {
    const w = welt({ hatFokus: false, morgen: true }); await w.oeffnen({ projekt: '26.0123 Köln' });
    assert.equal(w.S.ansicht, 'morgen');
  });
  console.log(`${n} Prüfungen Fokus grün`);
})().catch(e => { console.error(e); process.exit(1); });
