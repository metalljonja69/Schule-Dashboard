# Kickoff-Prompt: Studien-Dashboard

> Kopiere den Block unten in Claude Code (oder speichere die Datei als `SPEC.md` im leeren Projektordner und schreibe in Claude Code nur: „Lies SPEC.md und leg los.")
> Ersetze vorher die `<...>`-Platzhalter.

---

Ich möchte ein persönliches Studien-Dashboard bauen. Bitte arbeite als erfahrener Frontend-Entwickler und begleite mich vom leeren Ordner bis zur laufenden App.

## Kontext

- Studiengang: `BSc Wirtschaftsinformatik, ZHAW`
- Gesamt-ECTS für den Abschluss: `180`
- Aktuelles Semester: `<1 von 6>`
- Nutzung: nur ich, läuft über Homeserver, Tailscale, damit von überall abrufbar

## Tech-Stack

- Vite + React + TypeScript
- Tailwind CSS
- Recharts für Diagramme
- Persistenz: `localStorage`, gekapselt hinter einem Repository-Modul, damit später leicht auf SQLite/Supabase gewechselt werden kann
- Import/Export der gesamten Daten als JSON-Datei (mein Backup)

## Datenmodell (bitte in `src/types.ts` sauber typisieren)

- **Modul**: Name, Code, ECTS, Semester, Status (`geplant` | `laufend` | `bestanden` | `nicht bestanden`), Note (optional), Dozent (optional)
- **Termin**: Titel, Datum/Zeit, Typ (`Vorlesung` | `Prüfung` | `Abgabe` | `Sonstiges`), Modul-Referenz (optional), Ort, Notiz
- **Projekt**: Titel, Modul-Referenz, Deadline, Status, Fortschritt in %, Tasks (Titel + erledigt)

## Views

1. **Übersicht (Startseite)**
   - ECTS-Fortschritt: erreicht / gesamt, als Ring- oder Balkendiagramm, plus Prozentwert
   - „Nächste 14 Tage": chronologische Liste aller Termine und Deadlines, farbcodiert nach Typ
   - Kacheln: laufende Module, offene Projekte, Notendurchschnitt (gewichtet nach ECTS)
   - Warnhinweis für Deadlines in den nächsten 3 Tagen
2. **Module**: Tabelle mit Filter nach Semester und Status, Inline-Bearbeitung, ECTS-Summe pro Semester
3. **Kalender**: Monatsansicht mit Terminen, Klick auf Tag öffnet Detail/Anlegen
4. **Projekte**: Kanban-artige Spalten nach Status, Fortschritt aus erledigten Tasks berechnet

## Anforderungen

- Dark Mode als Standard, umschaltbar, Einstellung persistiert
- Responsive, aber für Desktop optimiert
- Tastatur-Shortcut zum schnellen Anlegen eines Termins
- Keine `any`-Typen, ESLint + Prettier konfiguriert
- Beim ersten Start: Beispieldaten (3 Module, 4 Termine, 1 Projekt), löschbar über einen Button

## Vorgehen

1. Stelle mir zuerst die offenen Fragen, die du zur Umsetzung brauchst — maximal fünf, gebündelt in einer Nachricht.
2. Zeige mir dann einen kurzen Plan: Ordnerstruktur, Komponentenbaum, Reihenfolge der Umsetzung.
3. Warte auf mein OK, dann setze Schritt für Schritt um. Nach jedem lauffähigen Meilenstein: Git-Commit mit aussagekräftiger Message und ein kurzer Hinweis, was ich testen soll.
4. Halte `README.md` aktuell (Setup, Scripts, Datenmodell).
5. Bei Architekturentscheidungen mit Trade-offs: nenne mir Optionen statt still zu entscheiden.

## Später (jetzt noch nicht bauen, aber Architektur offen halten)

- Import des Uni-Kalenders per `.ics`-Datei
- Notenrechner „Was brauche ich noch, um X zu erreichen?"
- Export der Semesterplanung als PDF
