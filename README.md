# TeamKit

Neuigkeiten und Pinnwand für das Büro – Teil der Spektron-Suite. Eine einzelne HTML-Datei, ohne Server, ohne fremde Skripte.

- **Neuigkeiten:** Überschrift, kurzer Text, Bereich (Spektron / Fachliches / Büro), freiwilliger Link, „Wichtig“ (oben angeheftet), „Anzeigen bis“.
- **Pinnwand:** Notizen, Umfragen („Bin dabei / Diesmal nicht“ mit Namen), „Danke!“, kurze Antworten. Notizen verschwinden nach 14 Tagen aus der Anzeige.
- Der Name des Schreibers kommt automatisch aus „Ich bin …“ (gleiche Einstellung wie in der Projektzentrale, Liste aus `_Spektron-Mitarbeiter.json`).

## Wo die Daten liegen

Nur in `<Archivordner>/_TeamKit` (im Büro `C:\Daten\Mosaik Archivordner\_TeamKit`). TeamKit liest sonst nur die Mitarbeiterliste und fasst keine Projektordner an. Nichts geht ins Netz oder in dieses Repo.

| Datei | Inhalt |
|---|---|
| `e-<JJJJMMTT>-<zufall>.json` | ein Eintrag (Neuigkeit oder Notiz). Nur der Schreiber ändert seine Datei; Löschen = Merker `geloescht` |
| `r-<JJJJMMTT>-<zufall>~<Kürzel>.json` | Reaktion einer Person auf einen Eintrag (Umfrage, Danke, Antworten) |

Je Person und Eintrag eine eigene Datei: zwei Leute schreiben nie in dieselbe Datei, es gibt keine Sperren. Dateien werden nie entfernt, nur ausgeblendet.

## Start

- Im Büro: Archivordner wie in der Projektzentrale (gemeinsamer Browser-Speicher `mosaik-suite` → `archiv`). Fehlt `_TeamKit`, legt ein Knopf den Ordner an.
- `?probe=1` oder „Nur ausprobieren“: ohne Ordner, Einträge bleiben nur in diesem Browser.
- `?eingebettet=1`: ohne eigene Marke, mit Schließen-Knopf – für die Anzeige in der Projektzentrale. TeamKit meldet dem umgebenden Fenster (nur gleiche Adresse) per `postMessage`:
  `{ quelle:'teamkit', art:'stand', neuNews, neuPinn, schlagzeile:{ titel, von, am } | null }` und `{ quelle:'teamkit', art:'schliessen' }`.

Die Anbindung an die Projektzentrale (Knopf mit Zähler, dünne Schlagzeile, Einschub von rechts) ist noch nicht gebaut.
