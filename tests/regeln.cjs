// TeamKit – Regeln ohne Browser (Audit Lauf 3, C13): Datum im Text (erkenneTag/bisAus), Lesefenster der Dateien (laden),
// „Neu“ bei „Gilt jetzt“ (giltNeu) und der Rückmeldung-Link. Lädt die Abschnitte aus index.html in eine eigene V8-Sitzung;
// das Datum „heute“ ist fest (Fr 20.11.2026, 10:00), damit der Test an jedem Tag gleich läuft. Nur erfundene Einträge.
// node tests/regeln.cjs
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const stueck = (von, bis) => { const a = html.indexOf(von), b = html.indexOf(bis, a); assert.ok(a > 0 && b > a, 'Abschnitt fehlt: ' + von); return html.slice(a, b); };
const JETZT = new Date(2026, 10, 20, 10, 0, 0).getTime();
class FesteZeit extends Date { constructor(...a){ if (a.length) super(...a); else super(JETZT); } static now(){ return JETZT; } }
function sitzung(lokal = {}){
  const speicher = new Map(Object.entries(lokal));
  const c = vm.createContext({ console, Map, Set, Math, Number, String, JSON, RegExp, Promise, Date: FesteZeit, URLSearchParams, isNaN,
    location: { search: '' }, window: {}, document: { getElementById: () => ({}) },
    localStorage: { getItem: k => speicher.has(k) ? speicher.get(k) : null, setItem: (k, v) => speicher.set(k, String(v)) } });
  c.window.parent = c.window; c.meldung = () => {};
  c.istIch = v => !!v && v.kuerzel === lokal.ich;   // Personen-Abschnitt braucht den Ordner – hier nur das Kürzel
  vm.runInContext(stueck('const TK_ORDNER', '/* ---------- Helfer') + stueck('/* ---------- Lesen', '/* ---------- Schreiben') +
    '\nglobalThis.T = { S, erkenneTag, bisAus, laden, giltNeu, kurzAktiv, K: { KURZ_DATUM_MAX, UEBERGANG_TAG } };', c);
  return c.T;
}
let n = 0; const ok = async (name, fn) => { await fn(); n++; console.log('OK ' + name); };
const de = d => d.toLocaleDateString('de-DE');

(async () => {
  await ok('Datum im Text: erster gültiger Treffer, Versionsnummern und unmögliche Daten zählen nicht', () => {
    const T = sitzung();
    const bis = t => de(T.bisAus('auto', t));
    assert.equal(bis('Update 0.4.2, Schulung am 20.11.'), '20.11.2026');
    assert.equal(bis('Rechnung 31.02. prüfen'), '20.11.2026', '31.02. gibt es nicht → bis heute Abend');
    assert.equal(bis('Termin am 20.11.2026 um 10.30 Uhr'), '20.11.2026');
    assert.equal(bis('Weihnachtsfeier 18.12.'), '18.12.2026');
    assert.equal(bis('Neujahrsessen 09.01.'), '9.1.2027', 'kurz nach dem Jahreswechsel: nächstes Jahr');
    assert.equal(bis('Urlaub bis 2.1.27'), '2.1.2027');
    assert.equal(bis('morgen Besprechung'), '21.11.2026');
    assert.equal(bis('Montag Ortstermin'), '23.11.2026');
    assert.equal(bis('Schulung 15.06.2027'), '19.1.2027', 'weiter als 60 Tage → auf 60 Tage gekappt');
  });

  await ok('C12: vergangenes Datum ohne Jahr hält eine Notiz nicht 60 Tage', () => {
    const T = sitzung();
    assert.equal(de(T.bisAus('auto', 'Fotos vom Sommerfest 12.09. liegen im Ordner')), '20.11.2026');
    assert.equal(de(T.bisAus('auto', 'Fotos vom 12.09. – Treffen am 25.11.')), '25.11.2026', 'vergangenes Datum übersprungen, nächster Treffer zählt');
    assert.equal(T.erkenneTag('Rückblick 15.10.'), null);
  });

  await ok('Lesefenster: kurze Beiträge der letzten 62 Tage, Termine nach ihrem Tag, Übergangstag, gelöschte und fremde Dateien nicht', async () => {
    const T = sitzung();
    const datei = o => ({ kind: 'file', getFile: async () => { const t = JSON.stringify(o); return { lastModified: 1, size: t.length, text: async () => t }; } });
    const kurz = (id, extra = {}) => [id + '.json', datei({ format: 'teamkit-kurz', version: 1, id, text: 'x', bis: '2026-11-20T23:59:00', am: '2026-11-01T08:00:00Z', von: { name: 'Nadine', kuerzel: 'Nad' }, ...extra })];
    const eintraege = [kurz('k-20261120-aaaaaa'), kurz('k-20260910-bbbbbb'), kurz('k-20261117-cccccc'), kurz('k-20270310-dddddd', { termin: '2027-03-10' }),
      kurz('k-20261119-eeeeee', { geloescht: true }), ['k-20261120-ffffff.json', datei({ format: 'fremd' })], ['notiz.txt', datei({})]];
    T.S.tk = { entries: async function* (){ for (const e of eintraege) yield e; } };
    await T.laden();
    assert.deepEqual([...T.S.kurz.map(e => e.id)].sort(), ['k-20261117-cccccc', 'k-20261120-aaaaaa', 'k-20270310-dddddd']);
  });

  await ok('„Neu“ bei Gilt jetzt: nur von anderen und nach der letzten Ansicht', () => {
    const T = sitzung({ 'teamkit-gilt-gesehen': '2026-11-19T12:00:00Z', ich: 'Ben' });
    const g = (id, am, k) => ({ id, art: 'gilt', am, von: { name: k, kuerzel: k }, erledigt: null });
    T.S.gilt = [g('g1', '2026-11-20T08:00:00Z', 'Nad'), g('g2', '2026-11-18T08:00:00Z', 'Nad'), g('g3', '2026-11-20T09:00:00Z', 'Ben')];
    assert.deepEqual([...T.giltNeu().map(e => e.id)], ['g1'], 'g2 schon gesehen, g3 eigener Beitrag');
  });

  await ok('Rückmeldung: „💬 Rückmeldung ↗“ (Tooltip „Fehler oder Wunsch melden“, E8) öffnet die Rückmeldung mit TeamKit und Version; Menü „Mehr …“', () => {
    assert.match(html, /<a id="mRueck" href="\.\.\/rueckmeldung\/\?app=teamkit" target="rueckmeldung" rel="noopener" title="Fehler oder Wunsch melden">💬 Rückmeldung ↗<\/a>/);
    assert.match(html, /<details class="mehr" id="mehr"><summary class="sp-knopf mehr-text">Mehr …<\/summary>/);
    assert.match(html, /\$\('mRueck'\)\.href = '\.\.\/rueckmeldung\/\?app=teamkit&version=' \+ encodeURIComponent\(APP_VERSION\)/);
  });

  console.log(`${n} Prüfungen TeamKit-Regeln bestanden`);
})().catch(e => { console.error(e); process.exit(1); });
