# TeamKit

Was ist heute und morgen los, und was gilt im Büro – Teil der Spektron-Suite. Eine einzelne HTML-Datei, ohne Server, ohne fremde Skripte. Schrift: Inter (`fonts/`, SIL Open Font License) liegt im Repo und wird offline mitgespeichert – kein Abruf aus dem Netz.

- **Guten Morgen** (einmal am Tag, nur wenn etwas los oder neu ist): „Heute & morgen“, höchstens drei neue „Gilt jetzt“-Beiträge, Knopf „Los geht’s“.
- **Heute & morgen:** kurze Notizen und Umfragen, nach Tagen sortiert. Die Dauer kommt aus dem Text („morgen“, „Freitag“, „18.12.“), sonst bis heute Abend; von Hand höchstens eine Woche. Danke, Antworten, Umfrage mit Namen.
- **Kalender** (oben rechts, auf dem Handy oben): Tag wählen, Text und freiwillig eine Uhrzeit eintragen. Der Termin steht sofort links unter seinem Datum und verschwindet, wenn der Tag vorbei ist. Bis zu einem Jahr im Voraus; Tage mit Terminen sind in der Farbe des Termins markiert; ein Klick auf so einen Tag hebt seine Termine links kurz hervor.
- **Gilt jetzt:** Regeln, Änderungen, Neuigkeiten fürs Büro. Bleiben, bis der Schreiber sie als erledigt markiert; danach im durchsuchbaren Archiv. „Wichtig“ wird oben angeheftet.
- Der Name des Schreibers kommt automatisch aus „Ich bin …“ (gleiche Einstellung wie in der Projektzentrale, Liste aus `_Spektron-Mitarbeiter.json`).

## Wo die Daten liegen

Nur in `<Archivordner>/_TeamKit` (im Büro `C:\Daten\Mosaik Archivordner\_TeamKit`). TeamKit liest sonst nur die Mitarbeiterliste und fasst keine Projektordner an. Nichts geht ins Netz oder in dieses Repo – **auch keine Fotos**.

| Datei | Inhalt |
|---|---|
| `k-<JJJJMMTT>-<zufall>.json` | kurzer Beitrag (Notiz/Umfrage) mit Ablauf `bis`. `JJJJMMTT` = Anlegetag, bei Terminen der Termintag. Als Termin zusätzlich `termin` (JJJJ-MM-TT), freiwillig `zeit` (HH:MM) und `farbe` (0–7, automatisch gewählt) |
| `g-<JJJJMMTT>-<zufall>.json` | „Gilt jetzt“-Beitrag; `erledigt` = im Archiv |
| `r-<Beitrags-ID>~<Kürzel>.json` | Reaktion einer Person (Umfrage, Danke, Antworten) |
| `s~<Kürzel>.json` | Status „Heute im Büro“ aus 0.2/0.3 – wird seit 0.3.1 nicht mehr gelesen oder geschrieben |
| `Fotos/<Kürzel>.jpg` | Foto (jpg/png/webp, z. B. `Nad.jpg`); ohne Foto erscheinen die Initialen |

Je Person und Beitrag eine eigene Datei: zwei Leute schreiben nie in dieselbe Datei, es gibt keine Sperren. Nur der Schreiber ändert seinen Beitrag. Dateien werden nie entfernt, nur ausgeblendet (Merker `geloescht`).

Gelesen werden `k-`-Dateien (und ihre Reaktionen) der letzten gut zwei Monate (`KURZ_DATUM_MAX` + 2 Tage) – Termine heißen nach ihrem Tag und fallen deshalb nicht heraus. Übergang: Termine aus 0.4.0–0.4.2 tragen den Anlegetag `20261117` im Namen und werden immer gelesen (in 0.5 entfernen).

## Start

- Im Büro: Archivordner wie in der Projektzentrale (Browser-Speicher `mosaik-suite` → `archiv`). Fehlt `_TeamKit`, legt ein Knopf den Ordner an.
- `?probe=1` oder „Nur ausprobieren“: ohne Ordner, Beiträge bleiben nur in diesem Browser.
- `?start=morgen|team`: Ansicht erzwingen.
- `?eingebettet=1`: für die Projektzentrale (siehe unten). `&projekt=26.0527` funktioniert noch, ist aber nicht mehr der Hauptweg.

## Einbettung (Projektzentrale)

Die Projektzentrale (gleiche Adresse `kaspersebastian83-dot.github.io`) lädt TeamKit unsichtbar als `../teamkit/?eingebettet=1` in einen Rahmen unter ihrer 52-px-Leiste. Statt der Marke zeigt TeamKit dann „Zurück zur Projektzentrale“ bzw. „Zurück zum Projekt …“. Nachrichten gehen per `postMessage` nur an und von derselben Adresse; TeamKit nimmt nur Nachrichten vom eigenen Elternfenster an.

**TeamKit → Projektzentrale**

| Nachricht | Wann |
|---|---|
| `{ quelle:'teamkit', art:'stand', bereit:false, grund:'zugriff'\|'ordner'\|'archiv'\|'browser' }` | TeamKit kann (noch) nicht lesen: keine Erlaubnis, `_TeamKit` fehlt, kein Archivordner gewählt, falscher Browser. Die PZ zeigt den Knopf ohne Zahl. |
| `{ quelle:'teamkit', art:'stand', bereit:true, neuGilt, heute, morgenFaellig, schlagzeile:{ id, titel, von, am, wichtig } \| null }` | nach dem Start und nach jedem Nachlesen. `schlagzeile` = neuester neuer „Gilt jetzt“-Beitrag, „Wichtig“ zuerst; die PZ zeigt sie nur bei `wichtig`. |
| `{ quelle:'teamkit', art:'schliessen' }` | „Zurück“, Esc oder „Los geht’s“ auf der Guten-Morgen-Seite – die PZ blendet den Rahmen aus. |

**Projektzentrale → TeamKit**

| Nachricht | Wirkung |
|---|---|
| `{ quelle:'projektzentrale', art:'oeffnen', projekt?, id? }` | Rahmen wird sichtbar: TeamKit liest neu und zeigt Guten Morgen (wenn fällig) oder die Team-Ansicht; mit `id` direkt diesen „Gilt jetzt“-Beitrag geöffnet. Ohne Zugriff bleibt der Zugangs-Schirm – der Klick im sichtbaren Rahmen kann dann nach der Erlaubnis fragen. `projekt` setzt „Zurück zum Projekt …“. |
| `{ quelle:'projektzentrale', art:'zu' }` | die PZ hat den Rahmen selbst ausgeblendet (z. B. Esc in der PZ): offene Antworten/Rückfragen zu, leeres „Gilt jetzt“-Formular zu, Stand melden. |

**Fokus (ab 0.5.2, Audit Lauf 5 E6):** Nach `oeffnen` setzt TeamKit den Fokus (Eingabefeld, „Los geht’s“, Beitrag, Zugangs-Überschrift) nur, wenn sein Dokument ihn hat (`document.hasFocus()` – die PZ fokussiert den Rahmen beim Öffnen). Kommt die Nachricht erst an, wenn man schon wieder in der PZ ist, bleibt der Fokus dort.

Solange TeamKit unsichtbar im Rahmen liegt, gilt nichts als gesehen: `teamkit-morgen` und `teamkit-gilt-gesehen` setzen nur „Los geht’s“, „Zurück“/Esc, „Alles anzeigen“ und „Zurück“ aus Archiv/Über.

**Testseite:** `rahmen-test.html` bettet TeamKit genau so ein, zeigt alle Nachrichten mit Uhrzeit und den Stand („bereit: ja/nein“). `rahmen-test.html?probe=1` lädt TeamKit im Probe-Modus. Die Seite enthält keine Daten und liegt nicht im Offline-Speicher.

## Rückmeldung

Unter „Mehr …“ › „💬 Rückmeldung ↗“ (Tooltip „Fehler oder Wunsch melden“) öffnet die Rückmeldung-App mit TeamKit und Version vorgewählt (`../rueckmeldung/?app=teamkit&version=…`, ab Rückmeldung 1.5.0).

## Tests

```sh
node tests/regeln.cjs   # Datum im Text, Lesefenster der Dateien, „Neu“ bei Gilt jetzt, Rückmeldung-Link – ohne Browser, festes Datum
node tests/fokus.cjs    # Fokus beim Öffnen aus der Projektzentrale nur, wenn TeamKit ihn hat (E6)
node tests/look.cjs     # SPEKTRON-LOOK byte-gleich mit BerichtKit (liegt ../berichtkit daneben; TEAMKIT_LOOK_PFLICHT=1 in der CI)
```

Läuft in GitHub Actions bei jedem Pull Request und auf `main` (`.github/workflows/tests.yml`).
