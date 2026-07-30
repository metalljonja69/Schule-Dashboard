import { useRef, useState, type ChangeEvent } from 'react';
import { EctsRing } from '../components/EctsRing';
import { useStudyData } from '../context/StudyDataContext';
import { exportiereAlsDatei, parseImportiertesJson } from '../lib/backup';
import { formatiereDatumZeit } from '../lib/datetime';
import { berechneNotendurchschnitt } from '../lib/grades';
import { expandOccurrences } from '../lib/occurrences';
import { PROJEKT_DEADLINE_FARBE, terminTypFarbe } from '../lib/terminTyp';

const DREI_TAGE_MS = 3 * 24 * 60 * 60 * 1000;
const VIERZEHN_TAGE_MS = 14 * 24 * 60 * 60 * 1000;

interface ListenEintrag {
  id: string;
  start: Date;
  titel: string;
  label: string;
  farbe: { badge: string; dot: string };
  modulName?: string;
}

export function OverviewView() {
  const { data, updateData, resetData } = useStudyData();
  const [nurBestandene, setNurBestandene] = useState(false);
  const [importFehler, setImportFehler] = useState<string | null>(null);
  const dateiInputRef = useRef<HTMLInputElement>(null);

  function handleReset() {
    const bestaetigt = window.confirm(
      'Alle Module, Termine und Projekte wirklich löschen? Das kann nicht rückgängig gemacht werden.',
    );
    if (bestaetigt) {
      resetData();
    }
  }

  function handleExport() {
    exportiereAlsDatei(data);
  }

  async function handleImportDatei(e: ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    e.target.value = '';
    if (!datei) return;

    try {
      const importiert = parseImportiertesJson(await datei.text());
      const bestaetigt = window.confirm(
        'Import ersetzt alle aktuellen Module, Termine und Projekte. Fortfahren?',
      );
      if (!bestaetigt) return;
      updateData(importiert);
      setImportFehler(null);
    } catch (error) {
      setImportFehler(error instanceof Error ? error.message : 'Unbekannter Fehler beim Import.');
    }
  }

  const modulName = (id?: string) => data.module.find((m) => m.id === id)?.name;

  const erreichtEcts = data.module
    .filter((m) => m.status === 'bestanden')
    .reduce((summe, m) => summe + m.ects, 0);
  const laufendEcts = data.module
    .filter((m) => m.status === 'laufend')
    .reduce((summe, m) => summe + m.ects, 0);

  const laufendeModuleAnzahl = data.module.filter((m) => m.status === 'laufend').length;
  const offeneProjekteAnzahl = data.projekte.filter((p) => p.status !== 'abgeschlossen').length;
  const notendurchschnitt = berechneNotendurchschnitt(data.module, nurBestandene);

  const jetzt = new Date();
  const in14Tagen = new Date(jetzt.getTime() + VIERZEHN_TAGE_MS);
  const in3Tagen = new Date(jetzt.getTime() + DREI_TAGE_MS);

  const terminEintraege: ListenEintrag[] = expandOccurrences(data.termine, {
    start: jetzt,
    ende: in14Tagen,
  }).map((occ) => ({
    id: occ.occurrenceId,
    start: occ.start,
    titel: occ.titel,
    label: occ.typ,
    farbe: terminTypFarbe(occ.typ),
    modulName: modulName(occ.modulId),
  }));

  const projektEintraege: ListenEintrag[] = data.projekte
    .filter((p) => p.status !== 'abgeschlossen')
    .map((p) => ({ projekt: p, deadline: new Date(p.deadline) }))
    .filter(({ deadline }) => deadline >= jetzt && deadline <= in14Tagen)
    .map(({ projekt, deadline }) => ({
      id: projekt.id,
      start: deadline,
      titel: `Deadline: ${projekt.titel}`,
      label: 'Projekt-Deadline',
      farbe: PROJEKT_DEADLINE_FARBE,
      modulName: modulName(projekt.modulId),
    }));

  const naechsteEintraege = [...terminEintraege, ...projektEintraege].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  const baldEintraege = naechsteEintraege.filter((e) => e.start <= in3Tagen);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Übersicht</h1>

      {baldEintraege.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <span className="font-medium">
            {baldEintraege.length === 1
              ? '1 Termin/Deadline'
              : `${baldEintraege.length} Termine/Deadlines`}{' '}
            in den nächsten 3 Tagen:
          </span>{' '}
          {baldEintraege.map((e) => e.titel).join(', ')}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            ECTS-Fortschritt
          </h2>
          <EctsRing erreichtEcts={erreichtEcts} laufendEcts={laufendEcts} />
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Erreicht
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-300" /> Laufend
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-semibold">{laufendeModuleAnzahl}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Laufende Module</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-semibold">{offeneProjekteAnzahl}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Offene Projekte</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-semibold">
              {notendurchschnitt.schnitt !== null ? notendurchschnitt.schnitt.toFixed(2) : '–'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Notendurchschnitt</p>
            <label className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={nurBestandene}
                onChange={(e) => setNurBestandene(e.target.checked)}
              />
              nur bestandene
            </label>
            {!nurBestandene && notendurchschnitt.anzahlLaufendeEinbezogen > 0 && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {notendurchschnitt.anzahlLaufendeEinbezogen} laufende(s) Modul(e) mit Note
                einbezogen
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Nächste 14 Tage</h2>
        {naechsteEintraege.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Keine Termine oder Deadlines in den nächsten 14 Tagen.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {naechsteEintraege.map((eintrag) => (
              <li key={eintrag.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className={`h-2 w-2 shrink-0 rounded-full ${eintrag.farbe.dot}`} />
                <span className="w-32 shrink-0 text-slate-500 dark:text-slate-400">
                  {formatiereDatumZeit(eintrag.start.toISOString())}
                </span>
                <span className="flex-1">
                  {eintrag.titel}
                  {eintrag.modulName && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {' '}
                      · {eintrag.modulName}
                    </span>
                  )}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${eintrag.farbe.badge}`}>
                  {eintrag.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 max-w-md rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold">{data.module.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Module</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{data.termine.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Termine</p>
          </div>
          <div>
            <p className="text-xl font-semibold">{data.projekte.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Projekte</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
          >
            Daten exportieren (JSON)
          </button>

          <button
            type="button"
            onClick={() => dateiInputRef.current?.click()}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
          >
            Daten importieren (JSON)
          </button>
          <input
            ref={dateiInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportDatei}
            className="hidden"
          />
          {importFehler && <p className="text-xs text-red-500">{importFehler}</p>}

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            Beispieldaten löschen
          </button>
        </div>
      </section>
    </div>
  );
}
