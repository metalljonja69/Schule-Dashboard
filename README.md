# Studien-Dashboard

Persönliches Studien-Dashboard für BSc Wirtschaftsinformatik (ZHAW, 180 ECTS).
Single-User-App, läuft als statischer Build auf einem Homeserver hinter Tailscale.

Details zu Anforderungen und Views: [`SPEC.md`](./SPEC.md).
Getroffene Architekturentscheidungen: [`DECISIONS.md`](./DECISIONS.md).

## Tech-Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router (Client-Side-Routing)
- date-fns (Datumslogik, `de-CH`, Zeitzone `Europe/Zurich`)
- Recharts (folgt in M3 für die ECTS-Visualisierung)
- Persistenz: `localStorage` hinter einem Repository-Modul (folgt in M1)

## Setup

```bash
npm install
npm run dev       # Dev-Server mit HMR
npm run build      # Typecheck + Produktions-Build nach dist/
npm run preview    # Produktions-Build lokal ansehen
npm run lint       # ESLint
npm run format     # Prettier (schreibt Änderungen)
```

## Datenmodell

Wird ab M1 in `src/types.ts` typisiert (Modul, Termin, Projekt). Siehe `SPEC.md` für die
Feldbeschreibung und `DECISIONS.md` für Details zu Noten-Logik, ECTS-Berechnung und
Terminverwaltung (`expandOccurrences`).

## Stand der Umsetzung

- [x] **M0** — Scaffold (Vite + React + TS + Tailwind + ESLint + Prettier), AppShell,
      Sidebar, Dark Mode als Standard (persistiert), Routing zwischen den vier Views
- [ ] **M1** — `src/types.ts`, `StudyRepository`, `localStorageRepo`, Beispieldaten, Reset-Button
- [ ] **M2** — Module-View (Tabelle, Filter, Inline-Bearbeitung, ECTS-Summe pro Semester)
- [ ] **M3** — Übersicht (ECTS-Ring, Kacheln, „Nächste 14 Tage", Deadline-Warnung)
- [ ] **M4** — Kalender (Monatsansicht, Termin-CRUD)
- [ ] **M5** — Projekte (Kanban-Spalten, Fortschritt aus Tasks)
- [ ] **M6** — JSON-Backup (Export/Import), Hotkey `n`
- [ ] **M7** — README-Feinschliff, Empty States, Responsive-Durchgang, Production-Build-Check

## Was du jetzt testen kannst (M0)

```bash
npm install
npm run dev
```

- Die App startet im **Dark Mode** (Standard). Über den Button unten in der Sidebar lässt
  sich zwischen Hell/Dunkel umschalten — die Wahl bleibt nach Reload erhalten
  (`localStorage`).
- Die Sidebar verlinkt die vier Views **Übersicht**, **Module**, **Kalender**, **Projekte**;
  jede zeigt aktuell einen Platzhalter, der auf den zuständigen Meilenstein verweist.
- `npm run build` sollte ohne Typfehler durchlaufen und einen `dist/`-Ordner erzeugen.

## Hinweis: `react-router-dom` und `npm audit`

`npm audit` meldet für `react-router-dom` aktuell High-Severity-Advisories (u.a. RSC-Mode-
CSRF, SSR-XSS). Diese betreffen ausschliesslich Server-Rendering/RSC/Data-Router-Features,
die hier nicht genutzt werden (reines Client-Side-SPA-Routing mit `BrowserRouter`, statischer
Build ohne SSR). Es existiert aktuell keine als "sauber" markierte Version im 7.x-Bereich;
ein Downgrade auf die letzte unbetroffene Version (`7.11.0`) würde neuere Bugfixes verlieren,
ohne unser Risiko zu senken. Empfehlung: bei der aktuellen Version (`^7.18.2`) bleiben und bei
Gelegenheit `npm audit` erneut prüfen, statt jetzt zu downgraden.
