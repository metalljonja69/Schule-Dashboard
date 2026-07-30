import { useState, type FormEvent } from 'react';
import { createId } from '../lib/id';
import type { Modul, Projekt, ProjektStatus, ProjektTask } from '../types';

const STATUS_OPTIONEN: ProjektStatus[] = ['geplant', 'laufend', 'abgeschlossen'];

function zweistellig(n: number): string {
  return String(n).padStart(2, '0');
}

function datumInputWert(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${zweistellig(d.getMonth() + 1)}-${zweistellig(d.getDate())}`;
}

const inputClass =
  'w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950';

interface ProjektFormProps {
  bearbeitetesProjekt?: Projekt;
  vorgabeStatus?: ProjektStatus;
  module: Modul[];
  onSubmit: (projekt: Projekt) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ProjektForm({
  bearbeitetesProjekt,
  vorgabeStatus,
  module,
  onSubmit,
  onCancel,
  onDelete,
}: ProjektFormProps) {
  const [titel, setTitel] = useState(bearbeitetesProjekt?.titel ?? '');
  const [modulId, setModulId] = useState(bearbeitetesProjekt?.modulId ?? '');
  const [deadline, setDeadline] = useState(
    bearbeitetesProjekt ? datumInputWert(bearbeitetesProjekt.deadline) : '',
  );
  const [status, setStatus] = useState<ProjektStatus>(
    bearbeitetesProjekt?.status ?? vorgabeStatus ?? 'geplant',
  );
  const [tasks, setTasks] = useState<ProjektTask[]>(bearbeitetesProjekt?.tasks ?? []);
  const [neuerTask, setNeuerTask] = useState('');

  function taskHinzufuegen() {
    const titelTrim = neuerTask.trim();
    if (!titelTrim) return;
    setTasks((t) => [...t, { id: createId(), titel: titelTrim, erledigt: false }]);
    setNeuerTask('');
  }

  function taskUmschalten(id: string) {
    setTasks((t) =>
      t.map((task) => (task.id === id ? { ...task, erledigt: !task.erledigt } : task)),
    );
  }

  function taskLoeschen(id: string) {
    setTasks((t) => t.filter((task) => task.id !== id));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const projekt: Projekt = {
      id: bearbeitetesProjekt?.id ?? createId(),
      titel: titel.trim() || 'Ohne Titel',
      modulId: modulId || undefined,
      deadline: new Date(
        `${deadline || datumInputWert(new Date().toISOString())}T23:59:00`,
      ).toISOString(),
      status,
      tasks,
    };
    onSubmit(projekt);
  }

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
          Deadline
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjektStatus)}
            className={inputClass}
          >
            {STATUS_OPTIONEN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

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

      <div className="flex flex-col gap-1 text-sm">
        Tasks
        <ul className="flex flex-col gap-1">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.erledigt}
                onChange={() => taskUmschalten(task.id)}
              />
              <span className={`flex-1 ${task.erledigt ? 'text-slate-400 line-through' : ''}`}>
                {task.titel}
              </span>
              <button
                type="button"
                onClick={() => taskLoeschen(task.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={neuerTask}
            onChange={(e) => setNeuerTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                taskHinzufuegen();
              }
            }}
            placeholder="Neuer Task"
            className={inputClass}
          />
          <button
            type="button"
            onClick={taskHinzufuegen}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            + Task
          </button>
        </div>
      </div>

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
