import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { Modal } from '../components/Modal';
import { TerminForm } from '../components/TerminForm';
import { useStudyData } from '../context/StudyDataContext';
import { formatiereMonatUndJahr, formatiereUhrzeit, zurichTagesSchluessel } from '../lib/datetime';
import { expandOccurrences, type Occurrence } from '../lib/occurrences';
import { terminTypFarbe } from '../lib/terminTyp';
import type { Termin } from '../types';

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function zweistellig(n: number): string {
  return String(n).padStart(2, '0');
}

/** Kalendertag der Rasterzelle selbst — im Gegensatz zu `zurichTagesSchluessel`
 *  (für echte Zeitstempel) ist das nur eine abstrakte Kalenderdatums-Angabe. */
function tagesSchluessel(tag: Date): string {
  return `${tag.getFullYear()}-${zweistellig(tag.getMonth() + 1)}-${zweistellig(tag.getDate())}`;
}

const buttonClass = 'rounded-md border border-slate-300 px-2.5 py-1 text-sm dark:border-slate-700';

export function CalendarView() {
  const { data, updateData } = useStudyData();
  const [sichtMonat, setSichtMonat] = useState(() => startOfMonth(new Date()));
  const [ausgewaehlterTag, setAusgewaehlterTag] = useState<string | null>(null);
  const [formularOffenFuer, setFormularOffenFuer] = useState<Termin | 'neu' | null>(null);

  const gridStart = startOfWeek(startOfMonth(sichtMonat), { weekStartsOn: 1 });
  const gridEnde = endOfWeek(endOfMonth(sichtMonat), { weekStartsOn: 1 });
  const tage = eachDayOfInterval({ start: gridStart, end: gridEnde });

  const occurrences = expandOccurrences(data.termine, { start: gridStart, ende: gridEnde });
  const proTag = new Map<string, Occurrence[]>();
  for (const occ of occurrences) {
    const key = zurichTagesSchluessel(occ.start);
    proTag.set(key, [...(proTag.get(key) ?? []), occ]);
  }

  function oeffneTag(tag: string) {
    setAusgewaehlterTag(tag);
    setFormularOffenFuer(null);
  }

  function schliesseModal() {
    setAusgewaehlterTag(null);
    setFormularOffenFuer(null);
  }

  function speichereTermin(termin: Termin) {
    const existiert = data.termine.some((t) => t.id === termin.id);
    updateData({
      ...data,
      termine: existiert
        ? data.termine.map((t) => (t.id === termin.id ? termin : t))
        : [...data.termine, termin],
    });
    setFormularOffenFuer(null);
  }

  function loescheTermin(id: string) {
    updateData({ ...data, termine: data.termine.filter((t) => t.id !== id) });
    setFormularOffenFuer(null);
  }

  const tagesTermine = ausgewaehlterTag ? (proTag.get(ausgewaehlterTag) ?? []) : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSichtMonat((m) => subMonths(m, 1))}
            className={buttonClass}
            aria-label="Vorheriger Monat"
          >
            ←
          </button>
          <span className="min-w-40 text-center text-sm font-medium capitalize">
            {formatiereMonatUndJahr(sichtMonat)}
          </span>
          <button
            type="button"
            onClick={() => setSichtMonat((m) => addMonths(m, 1))}
            className={buttonClass}
            aria-label="Nächster Monat"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => setSichtMonat(startOfMonth(new Date()))}
            className={buttonClass}
          >
            Heute
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
        {WOCHENTAGE.map((tag) => (
          <div
            key={tag}
            className="bg-slate-50 px-2 py-1 text-center text-xs font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          >
            {tag}
          </div>
        ))}
        {tage.map((tag) => {
          const key = tagesSchluessel(tag);
          const termineDesTages = proTag.get(key) ?? [];
          const inMonat = isSameMonth(tag, sichtMonat);
          return (
            <button
              key={key}
              type="button"
              onClick={() => oeffneTag(key)}
              className={`min-h-24 bg-white p-1.5 text-left align-top hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 ${
                inMonat ? '' : 'opacity-40'
              } ${isToday(tag) ? 'ring-2 ring-inset ring-indigo-500' : ''}`}
            >
              <span className="text-xs">{tag.getDate()}</span>
              <div className="mt-1 flex flex-col gap-0.5">
                {termineDesTages.slice(0, 3).map((occ) => (
                  <span
                    key={occ.occurrenceId}
                    className={`truncate rounded px-1 py-0.5 text-[10px] ${terminTypFarbe(occ.typ).badge}`}
                  >
                    {formatiereUhrzeit(occ.start.toISOString())} {occ.titel}
                  </span>
                ))}
                {termineDesTages.length > 3 && (
                  <span className="text-[10px] text-slate-400">
                    +{termineDesTages.length - 3} mehr
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {ausgewaehlterTag && formularOffenFuer === null && (
        <Modal titel={ausgewaehlterTag} onClose={schliesseModal}>
          {tagesTermine.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keine Termine an diesem Tag.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {tagesTermine.map((occ) => {
                const termin = data.termine.find((t) => t.id === occ.terminId);
                if (!termin) return null;
                return (
                  <li key={occ.occurrenceId}>
                    <button
                      type="button"
                      onClick={() => setFormularOffenFuer(termin)}
                      className="flex w-full items-center gap-2 rounded border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${terminTypFarbe(occ.typ).dot}`}
                      />
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatiereUhrzeit(occ.start.toISOString())}
                      </span>
                      <span className="flex-1">{occ.titel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setFormularOffenFuer('neu')}
            className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            + Termin
          </button>
        </Modal>
      )}

      {ausgewaehlterTag && formularOffenFuer !== null && (
        <Modal
          titel={formularOffenFuer === 'neu' ? 'Neuer Termin' : 'Termin bearbeiten'}
          onClose={schliesseModal}
        >
          <TerminForm
            bearbeiteterTermin={formularOffenFuer === 'neu' ? undefined : formularOffenFuer}
            vorgabeDatum={ausgewaehlterTag}
            module={data.module}
            onSubmit={speichereTermin}
            onCancel={() => setFormularOffenFuer(null)}
            onDelete={
              formularOffenFuer === 'neu' ? undefined : () => loescheTermin(formularOffenFuer.id)
            }
          />
        </Modal>
      )}
    </div>
  );
}
