import { useState, type FormEvent } from 'react';
import { createId } from '../lib/id';
import type { Modul, Termin, TerminTyp } from '../types';

const TYP_OPTIONEN: TerminTyp[] = ['Vorlesung', 'Prüfung', 'Abgabe', 'Sonstiges'];

function zweistellig(n: number): string {
  return String(n).padStart(2, '0');
}

function datumInputWert(datum: Date): string {
  return `${datum.getFullYear()}-${zweistellig(datum.getMonth() + 1)}-${zweistellig(datum.getDate())}`;
}

function zeitInputWert(datum: Date): string {
  return `${zweistellig(datum.getHours())}:${zweistellig(datum.getMinutes())}`;
}

interface TerminFormProps {
  bearbeiteterTermin?: Termin;
  vorgabeDatum?: string;
  module: Modul[];
  onSubmit: (termin: Termin) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TerminForm({
  bearbeiteterTermin,
  vorgabeDatum,
  module,
  onSubmit,
  onCancel,
  onDelete,
}: TerminFormProps) {
  const startwert = bearbeiteterTermin
    ? new Date(bearbeiteterTermin.datumZeit)
    : vorgabeDatum
      ? new Date(`${vorgabeDatum}T08:00:00`)
      : new Date();

  const [titel, setTitel] = useState(bearbeiteterTermin?.titel ?? '');
  const [datum, setDatum] = useState(datumInputWert(startwert));
  const [zeit, setZeit] = useState(zeitInputWert(startwert));
  const [typ, setTyp] = useState<TerminTyp>(bearbeiteterTermin?.typ ?? 'Vorlesung');
  const [modulId, setModulId] = useState(bearbeiteterTermin?.modulId ?? '');
  const [ort, setOrt] = useState(bearbeiteterTermin?.ort ?? '');
  const [notiz, setNotiz] = useState(bearbeiteterTermin?.notiz ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const termin: Termin = {
      id: bearbeiteterTermin?.id ?? createId(),
      titel: titel.trim() || 'Ohne Titel',
      datumZeit: new Date(`${datum}T${zeit}:00`).toISOString(),
      typ,
      modulId: modulId || undefined,
      ort: ort || undefined,
      notiz: notiz || undefined,
      recurrence: null,
    };
    onSubmit(termin);
  }

  const inputClass =
    'w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Titel
        <input
          type="text"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          className={inputClass}
          autoFocus
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Datum
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Zeit
          <input
            type="time"
            value={zeit}
            onChange={(e) => setZeit(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Typ
        <select
          value={typ}
          onChange={(e) => setTyp(e.target.value as TerminTyp)}
          className={inputClass}
        >
          {TYP_OPTIONEN.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Modul (optional)
        <select value={modulId} onChange={(e) => setModulId(e.target.value)} className={inputClass}>
          <option value="">Kein Modul</option>
          {module.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Ort
        <input
          type="text"
          value={ort}
          onChange={(e) => setOrt(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Notiz
        <textarea
          value={notiz}
          onChange={(e) => setNotiz(e.target.value)}
          className={inputClass}
          rows={2}
        />
      </label>

      <div className="mt-2 flex items-center justify-between">
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Löschen
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Speichern
          </button>
        </div>
      </div>
    </form>
  );
}
