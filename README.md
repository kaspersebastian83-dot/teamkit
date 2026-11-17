# TeamKit

Was ist heute und morgen los, und was gilt im Büro – Teil der Spektron-Suite. Eine einzelne HTML-Datei, ohne Server, ohne fremde Skripte. Schrift: Inter (`fonts/`, SIL Open Font License) liegt im Repo und wird offline mitgespeichert – kein Abruf aus dem Netz.

- **Guten Morgen** (einmal am Tag, nur wenn etwas los oder neu ist): „Heute & morgen“, höchstens drei neue „Gilt jetzt“-Beiträge, Knopf „Los geht’s“.
- **Heute & morgen:** kurze Notizen und Umfragen, nach Tagen sortiert. Die Dauer kommt aus dem Text („morgen“, „Freitag“, „18.12.“), sonst bis heute Abend; von Hand höchstens eine Woche. Danke, Antworten, Umfrage mit Namen.
- **Kalender** (oben rechts, auf dem Handy oben): Tag wählen, Text und freiwillig eine Uhrzeit eintragen. Der Termin steht sofort links unter seinem Datum und verschwindet, wenn der Tag vorbei ist. Bis zu einem Jahr im Voraus; Tage mit Terminen haben einen Punkt.
- **Gilt jetzt:** Regeln, Änderungen, Neuigkeiten fürs Büro. Bleiben, bis der Schreiber sie als erledigt markiert; danach im durchsuchbaren Archiv. „Wichtig“ wird oben angeheftet.
- Der Name des Schreibers kommt automatisch aus „Ich bin …“ (gleiche Einstellung wie in der Projektzentrale, Liste aus `_Spektron-Mitarbeiter.json`).

## Wo die Daten liegen

Nur in `<Archivordner>/_TeamKit` (im Büro `C:\Daten\Mosaik Archivordner\_TeamKit`). TeamKit liest sonst nur die Mitarbeiterliste und fasst keine Projektordner an. Nichts geht ins Netz oder in dieses Repo – **auch keine Fotos**.

| Datei | Inhalt |
|---|---|
| `k-<JJJJMMTT>-<zufall>.json` | kurzer Beitrag (Notiz/Umfrage) mit Ablauf `bis`; als Termin zusätzlich `termin` (JJJJ-MM-TT) und freiwillig `zeit` (HH:MM) |
| `g-<JJJJMMTT>-<zufall>.json` | „Gilt jetzt“-Beitrag; `erledigt` = im Archiv |
| `r-<Beitrags-ID>~<Kürzel>.json` | Reaktion einer Person (Umfrage, Danke, Antworten) |
| `s~<Kürzel>.json` | Status „Heute im Büro“ aus 0.2/0.3 – wird seit 0.3.1 nicht mehr gelesen oder geschrieben |
| `Fotos/<Kürzel>.jpg` | Foto (jpg/png/webp, z. B. `Nad.jpg`); ohne Foto erscheinen die Initialen |

Je Person und Beitrag eine eigene Datei: zwei Leute schreiben nie in dieselbe Datei, es gibt keine Sperren. Nur der Schreiber ändert seinen Beitrag. Dateien werden nie entfernt, nur ausgeblendet (Merker `geloescht`).

## Start

- Im Büro: Archivordner wie in der Projektzentrale (Browser-Speicher `mosaik-suite` → `archiv`). Fehlt `_TeamKit`, legt ein Knopf den Ordner an.
- `?probe=1` oder „Nur ausprobieren“: ohne Ordner, Beiträge bleiben nur in diesem Browser.
- `?start=morgen|team`: Ansicht erzwingen.
- `?eingebettet=1&projekt=26.0527`: für die Projektzentrale – statt der Marke ein Knopf „Zurück zum Projekt 26.0527“. TeamKit meldet dem umgebenden Fenster (nur gleiche Adresse) per `postMessage`:
  `{ quelle:'teamkit', art:'stand', neuGilt, heute, morgenFaellig, schlagzeile:{ titel, von, am, wichtig } | null }` und `{ quelle:'teamkit', art:'schliessen' }`.

Die Anbindung an die Projektzentrale (Knopf „Team“ mit Zähler, dünne Schlagzeile, Guten Morgen beim ersten Öffnen am Tag) ist noch nicht gebaut.
