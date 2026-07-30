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
- Recharts (ECTS-Ring auf der Übersicht)
- Persistenz: `localStorage` hinter einem Repository-Modul (`StudyRepository` /
  `localStorageRepo`), State via Context + `useReducer`

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

Typisiert in `src/types.ts`: `Modul`, `Termin`, `Projekt` (inkl. `ProjektTask`), zusammengefasst
im Root-Objekt `AppData` mit `schemaVersion`. Siehe `SPEC.md` für die Feldbeschreibung und
`DECISIONS.md` für Details zu Noten-Logik, ECTS-Berechnung und Terminverwaltung
(`expandOccurrences`, folgt ab M3/M4).

Der `Fortschritt in %` eines Projekts wird **nicht** gespeichert, sondern in M5 aus den
`tasks` berechnet (`erledigt`-Anteil) — vermeidet inkonsistente Werte zwischen Tasks und
gespeichertem Fortschritt.

Persistenz läuft über `StudyRepository` (`src/lib/repository.ts`, Promise-basiert) mit der
Implementierung `localStorageRepo` (`src/lib/localStorageRepo.ts`). Ein Root-Objekt
`AppData` liegt unter einem localStorage-Key; `schemaVersion` wird beim Laden geprüft,
unbekannte Versionen werden abgelehnt. Fehlen Daten beim ersten Start, werden Beispieldaten
erzeugt (`src/lib/sampleData.ts`: 3 Module, 4 Termine, 1 Projekt).

## Stand der Umsetzung

- [x] **M0** — Scaffold (Vite + React + TS + Tailwind + ESLint + Prettier), AppShell,
      Sidebar, Dark Mode als Standard (persistiert), Routing zwischen den vier Views
- [x] **M1** — `src/types.ts`, `StudyRepository`, `localStorageRepo`, Beispieldaten
      (3 Module, 4 Termine, 1 Projekt), Reset-Button, Context + `useReducer` als State-Layer
- [x] **M2** — Module-View (Tabelle, Filter nach Semester/Status, Inline-Bearbeitung,
      ECTS-Summe pro Semester, Modul hinzufügen/löschen)
- [x] **M3** — Übersicht (ECTS-Ring, Kacheln, „Nächste 14 Tage", Deadline-Warnung)
- [x] **M4** — Kalender (Monatsansicht, Termin-CRUD)
- [x] **M5** — Projekte (Kanban-Spalten, Fortschritt aus Tasks)
- [x] **M6** — JSON-Backup (Export/Import), Hotkey `n`
- [ ] **M7** — README-Feinschliff, Empty States, Responsive-Durchgang, Production-Build-Check

## Was du jetzt testen kannst (M0–M6)

```bash
npm install
npm run dev
```

- Die App startet im **Dark Mode** (Standard). Über den Button unten in der Sidebar lässt
  sich zwischen Hell/Dunkel umschalten — die Wahl bleibt nach Reload erhalten
  (`localStorage`).
- Die Sidebar verlinkt die vier Views **Übersicht**, **Module**, **Kalender**, **Projekte**.
- Beim ersten Aufruf erscheinen auf der **Übersicht** die Beispieldaten als Zähler
  (3 Module, 4 Termine, 1 Projekt). Reload → Zähler bleiben gleich (Daten liegen in
  `localStorage` unter dem Key `studien-dashboard:data`).
- **„Beispieldaten löschen"** fragt einmal nach (Bestätigungsdialog) und setzt danach alle
  drei Zähler auf 0 — auch nach einem Reload.
- Auf **Module** lassen sich Name/Code/ECTS/Semester/Status/Note/Dozent direkt in der
  Tabelle bearbeiten (Änderungen werden sofort gespeichert, auch reload-fest). Filter nach
  Semester und Status oben; darunter die ECTS-Summe je Semester für die aktuell gefilterte
  Ansicht. „+ Modul hinzufügen" legt eine leere Zeile an (übernimmt aktive Filter als
  Vorgabewerte), „Löschen" pro Zeile fragt einmal nach.
- Auf der **Übersicht** siehst du jetzt den ECTS-Ring (erreicht = bestandene ECTS, heller
  Segmentanteil = laufende ECTS, Prozentwert bezogen auf 180 ECTS), Kacheln für laufende
  Module/offene Projekte/Notendurchschnitt (Toggle „nur bestandene", Hinweis wie viele
  laufenden Module mit Note einfliessen) sowie die farbcodierte Liste „Nächste 14 Tage"
  (Termine + Projekt-Deadlines, sortiert). Fällt ein Termin/eine Deadline in die nächsten
  3 Tage, erscheint oben ein Warnbanner.
- Der **Kalender** zeigt ein eigenes Monatsraster (Woche startet Montag), Navigation über
  ←/→/„Heute". Ein Klick auf einen Tag öffnet die Termine dieses Tages; „+ Termin" legt
  einen neuen an (Titel, Datum/Zeit, Typ, optionales Modul, Ort, Notiz), ein bestehender
  Termin lässt sich anklicken zum Bearbeiten oder Löschen. Alles reload-fest.
- **Projekte** zeigt drei Kanban-Spalten (Geplant/Laufend/Abgeschlossen). Jede Karte zeigt
  Modul, Deadline und einen Fortschrittsbalken, der aus den erledigten Tasks berechnet wird
  (nicht gespeichert). Klick auf eine Karte öffnet Titel/Deadline/Modul/Status/Tasks zum
  Bearbeiten; „← ”/„→ ”-Buttons verschieben ein Projekt direkt in die Nachbarspalte;
  „+ Projekt" pro Spalte legt ein neues mit passendem Status an.
- Auf der **Übersicht** ganz unten: „Daten exportieren (JSON)" lädt ein Backup mit Zeitstempel
  im Dateinamen herunter. „Daten importieren (JSON)" liest eine Datei ein, prüft
  `schemaVersion` (unbekannte Version → Fehlermeldung, kein Datenverlust) und fragt vor dem
  Ersetzen aller Daten einmal nach.
- Taste **`n`** (ausserhalb von Eingabefeldern) öffnet von jeder View aus die
  Termin-Schnellanlage. `Cmd/Ctrl+K` ist reserviert für eine spätere Command Palette, tut
  aktuell bewusst nichts.
- `npm run build` sollte ohne Typfehler durchlaufen und einen `dist/`-Ordner erzeugen.

## Deployment (Homeserver, Docker + Caddy)

Der Container baut den Produktions-Build und liefert ihn über Caddy als statische Dateien
aus (`Dockerfile`, `Caddyfile`, `docker-compose.yml`).

```bash
docker compose up -d --build
```

Danach ist die App unter `http://<tailscale-ip-des-homeservers>:8080` erreichbar — der
Port wird per Docker auf allen Netzwerkschnittstellen des Hosts veröffentlicht, also auch
über die Tailscale-Schnittstelle, ohne dass zusätzlich etwas eingerichtet werden muss.

**Falls der Homeserver zusätzlich eine öffentlich erreichbare Netzwerkschnittstelle hat**
(z. B. direkt am Router mit Portweiterleitung), sollte der Port nicht offen auf `0.0.0.0`
liegen. Zwei Optionen:

- In `docker-compose.yml` die Portzuordnung auf `"127.0.0.1:8080:8080"` einschränken und
  stattdessen [`tailscale serve`](https://tailscale.com/kb/1242/tailscale-serve) verwenden:
  `tailscale serve --bg 8080` macht den Dienst dann ausschliesslich innerhalb des
  Tailnets erreichbar (inkl. TLS über den `.ts.net`-Namen).
- Oder die Firewall/den Router so konfigurieren, dass Port 8080 nicht von aussen erreichbar
  ist.

**Update nach neuem Commit:**

```bash
git pull
docker compose up -d --build
```

**Hinweis zum Testen:** Der Docker-Build wurde in dieser Umgebung nicht end-to-end
durchlaufen — der Sandbox-Container hier kann keinen eigenen Docker-Daemon starten
(kein privilegiertes Docker-in-Docker). `npm run build` (Basis des Image-Builds) läuft
fehlerfrei durch, Dockerfile und Caddyfile folgen Standard-Mustern; bitte einmal
`docker compose up -d --build` auf dem Homeserver verifizieren.

## Hinweis: `react-router-dom` und `npm audit`

`npm audit` meldet für `react-router-dom` aktuell High-Severity-Advisories (u.a. RSC-Mode-
CSRF, SSR-XSS). Diese betreffen ausschliesslich Server-Rendering/RSC/Data-Router-Features,
die hier nicht genutzt werden (reines Client-Side-SPA-Routing mit `BrowserRouter`, statischer
Build ohne SSR). Es existiert aktuell keine als "sauber" markierte Version im 7.x-Bereich;
ein Downgrade auf die letzte unbetroffene Version (`7.11.0`) würde neuere Bugfixes verlieren,
ohne unser Risiko zu senken. Empfehlung: bei der aktuellen Version (`^7.18.2`) bleiben und bei
Gelegenheit `npm audit` erneut prüfen, statt jetzt zu downgraden.
