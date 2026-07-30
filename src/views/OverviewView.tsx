import { useStudyData } from '../context/StudyDataContext';

export function OverviewView() {
  const { data, resetData } = useStudyData();

  function handleReset() {
    const bestaetigt = window.confirm(
      'Alle Module, Termine und Projekte wirklich löschen? Das kann nicht rückgängig gemacht werden.',
    );
    if (bestaetigt) {
      resetData();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Übersicht</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        ECTS-Fortschritt, Kacheln und „Nächste 14 Tage" folgen in M3.
      </p>

      <div className="mt-6 flex max-w-md flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{data.module.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Module</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{data.termine.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Termine</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{data.projekte.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Projekte</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Beispieldaten löschen
        </button>
      </div>
    </div>
  );
}
