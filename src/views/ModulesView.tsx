import { useMemo, useState } from 'react';
import { useStudyData } from '../context/StudyDataContext';
import { createId } from '../lib/id';
import type { Modul, ModulStatus } from '../types';

const SEMESTER_OPTIONEN = [1, 2, 3, 4, 5, 6];
const STATUS_OPTIONEN: ModulStatus[] = ['geplant', 'laufend', 'bestanden', 'nicht bestanden'];

const inputClass =
  'w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm hover:border-slate-300 focus:border-indigo-500 focus:outline-none dark:hover:border-slate-700';

export function ModulesView() {
  const { data, updateData } = useStudyData();
  const [semesterFilter, setSemesterFilter] = useState<number | 'alle'>('alle');
  const [statusFilter, setStatusFilter] = useState<ModulStatus | 'alle'>('alle');

  const gefiltert = useMemo(() => {
    return data.module
      .filter((m) => semesterFilter === 'alle' || m.semester === semesterFilter)
      .filter((m) => statusFilter === 'alle' || m.status === statusFilter)
      .sort((a, b) => a.semester - b.semester || a.name.localeCompare(b.name, 'de-CH'));
  }, [data.module, semesterFilter, statusFilter]);

  const summenProSemester = useMemo(() => {
    const summen = new Map<number, number>();
    for (const m of gefiltert) {
      summen.set(m.semester, (summen.get(m.semester) ?? 0) + m.ects);
    }
    return [...summen.entries()].sort(([a], [b]) => a - b);
  }, [gefiltert]);

  function updateModul(id: string, changes: Partial<Modul>) {
    updateData({
      ...data,
      module: data.module.map((m) => (m.id === id ? { ...m, ...changes } : m)),
    });
  }

  function deleteModul(modul: Modul) {
    const bestaetigt = window.confirm(`Modul "${modul.name || 'unbenannt'}" wirklich löschen?`);
    if (!bestaetigt) return;
    updateData({ ...data, module: data.module.filter((m) => m.id !== modul.id) });
  }

  function neuesModul() {
    const neu: Modul = {
      id: createId(),
      name: '',
      code: '',
      ects: 0,
      semester: semesterFilter === 'alle' ? 1 : semesterFilter,
      status: statusFilter === 'alle' ? 'geplant' : statusFilter,
    };
    updateData({ ...data, module: [...data.module, neu] });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Module</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          Semester
          <select
            value={semesterFilter}
            onChange={(e) =>
              setSemesterFilter(e.target.value === 'alle' ? 'alle' : Number(e.target.value))
            }
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="alle">Alle</option>
            {SEMESTER_OPTIONEN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          Status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ModulStatus | 'alle')}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="alle">Alle</option>
            {STATUS_OPTIONEN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={neuesModul}
          className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Modul hinzufügen
        </button>
      </div>

      {summenProSemester.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          {summenProSemester.map(([semester, summe]) => (
            <span key={semester} className="rounded-full bg-slate-200 px-3 py-1 dark:bg-slate-800">
              Semester {semester}: {summe} ECTS
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Code</th>
              <th className="px-3 py-2 font-medium">ECTS</th>
              <th className="px-3 py-2 font-medium">Semester</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Note</th>
              <th className="px-3 py-2 font-medium">Dozent</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {gefiltert.map((modul) => (
              <tr
                key={modul.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
              >
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={modul.name}
                    onChange={(e) => updateModul(modul.id, { name: e.target.value })}
                    className={inputClass}
                    aria-label="Name"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={modul.code}
                    onChange={(e) => updateModul(modul.id, { code: e.target.value })}
                    className={inputClass}
                    aria-label="Code"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min={0}
                    value={modul.ects}
                    onChange={(e) => updateModul(modul.id, { ects: Number(e.target.value) })}
                    className={`${inputClass} w-16`}
                    aria-label="ECTS"
                  />
                </td>
                <td className="px-1 py-1">
                  <select
                    value={modul.semester}
                    onChange={(e) => updateModul(modul.id, { semester: Number(e.target.value) })}
                    className={inputClass}
                    aria-label="Semester"
                  >
                    {SEMESTER_OPTIONEN.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1 py-1">
                  <select
                    value={modul.status}
                    onChange={(e) =>
                      updateModul(modul.id, { status: e.target.value as ModulStatus })
                    }
                    className={inputClass}
                    aria-label="Status"
                  >
                    {STATUS_OPTIONEN.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    step={0.25}
                    value={modul.note ?? ''}
                    onChange={(e) =>
                      updateModul(modul.id, {
                        note: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className={`${inputClass} w-20`}
                    aria-label="Note"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="text"
                    value={modul.dozent ?? ''}
                    onChange={(e) => updateModul(modul.id, { dozent: e.target.value })}
                    className={inputClass}
                    aria-label="Dozent"
                  />
                </td>
                <td className="px-1 py-1 text-right">
                  <button
                    type="button"
                    onClick={() => deleteModul(modul)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {gefiltert.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-slate-400">
                  Keine Module für diese Filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
