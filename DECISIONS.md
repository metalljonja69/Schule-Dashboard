# Entscheidungen — Studien-Dashboard

Ergänzung zu `SPEC.md`. Diese Punkte sind entschieden, hier bitte nicht nachfragen.

## Rahmen

- Studiengang: BSc Wirtschaftsinformatik, ZHAW — 180 ECTS
- Aktuelles Semester: **1 von 6**
- Nutzung: Single-User, Homeserver hinter Tailscale
- Deployment: statischer Build, `base: './'`, ausgeliefert über nginx/Caddy

## Noten

- Skala 1.0–6.0, bestanden ab 4.0, Schritte von 0.25
- Durchschnitt gewichtet nach ECTS
- Es zählen Module mit Status `bestanden` **und** `laufend`, sofern eine Zwischennote gesetzt ist
- Anzeige mit Hinweis, wie viele laufende Module einfliessen, plus Umschalter „nur bestandene"
- `nicht bestanden` zählt nie in den Durchschnitt

## ECTS-Fortschritt

- Erreicht = Summe ECTS aller Module mit Status `bestanden`
- `laufend` wird als hellerer Segmentanteil im Ring dargestellt, nicht als erreicht gezählt

## Termine

- Wiederkehrende Termine werden **jetzt nicht** implementiert
- `Termin` erhält trotzdem `recurrence?: RecurrenceRule | null`; unterstützt wird ausschliesslich `null`
- Verbindlich: keine View iteriert direkt über `events`. Alle Lesezugriffe laufen über
  `expandOccurrences(events, range): Occurrence[]` in `src/lib/occurrences.ts`.
  Heute ein Filter über den Zeitraum — später der Ort für Recurrence-Expansion und `.ics`-Import.

## Locale & Zeit

- `de-CH`, Woche beginnt Montag, Zeitzone fix `Europe/Zurich`
- Datumsangaben als ISO-String im Storage, Formatierung erst in der View

## Persistenz

- `StudyRepository` als `Promise`-basiertes Interface, auch wenn localStorage synchron ist
- Implementierung `localStorageRepo.ts`, ein Root-Objekt `AppData` mit `schemaVersion`
- JSON-Export/Import validiert `schemaVersion` und verweigert unbekannte Versionen

## Technische Wahl

- State: Context + `useReducer` (kein Zustand/Redux)
- Datums-Logik: `date-fns`
- Kalender: eigenes Monatsraster, keine Kalender-Library
- Keine `any`-Typen, ESLint + Prettier konfiguriert

## Shortcuts

- `n` → Termin-Schnellanlage (nicht aktiv in Eingabefeldern)
- `Cmd/Ctrl+K` → Platzhalter für Command Palette, vorerst ohne Funktion

## Meilensteine

Nach jedem Meilenstein: Git-Commit mit aussagekräftiger Message plus kurzer Hinweis, was zu testen ist.

- **M0** Scaffold (Vite + React + TS + Tailwind + ESLint + Prettier), AppShell, Sidebar, Dark Mode als Standard und persistiert, Routing
- **M1** `src/types.ts`, `StudyRepository`, `localStorageRepo`, Beispieldaten beim Erststart (3 Module, 4 Termine, 1 Projekt), Reset-Button
- **M2** Module-View: Tabelle, Filter nach Semester und Status, Inline-Bearbeitung, ECTS-Summe pro Semester
- **M3** Übersicht: ECTS-Ring mit Prozentwert, Kacheln (laufende Module, offene Projekte, Notenschnitt), „Nächste 14 Tage" farbcodiert, Warnhinweis für Deadlines in 3 Tagen
- **M4** Kalender: Monatsansicht, Klick auf Tag öffnet Detail/Anlegen, Termin-CRUD über `expandOccurrences`
- **M5** Projekte: Kanban-Spalten nach Status, Fortschritt aus erledigten Tasks berechnet
- **M6** JSON-Backup: Export als Download, Import mit Validierung; Hotkey `n`
- **M7** README aktualisieren, Empty States, Responsive-Durchgang, Production-Build prüfen

## Arbeitsweise

- Bei Architekturentscheidungen mit Trade-offs: Optionen nennen statt still entscheiden
- `README.md` laufend aktuell halten (Setup, Scripts, Datenmodell)
