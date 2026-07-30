import { useState } from 'react';
import { Modal } from '../components/Modal';
import { ProjektForm } from '../components/ProjektForm';
import { useStudyData } from '../context/StudyDataContext';
import { formatiereDatumKurz } from '../lib/datetime';
import { berechneFortschritt } from '../lib/projects';
import type { Projekt, ProjektStatus } from '../types';

const SPALTEN: ProjektStatus[] = ['geplant', 'laufend', 'abgeschlossen'];
const SPALTEN_LABEL: Record<ProjektStatus, string> = {
  geplant: 'Geplant',
  laufend: 'Laufend',
  abgeschlossen: 'Abgeschlossen',
};

export function ProjectsView() {
  const { data, updateData } = useStudyData();
  const [bearbeitung, setBearbeitung] = useState<Projekt | ProjektStatus | null>(null);

  const modulName = (id?: string) => data.module.find((m) => m.id === id)?.name;

  function speichereProjekt(projekt: Projekt) {
    const existiert = data.projekte.some((p) => p.id === projekt.id);
    updateData({
      ...data,
      projekte: existiert
        ? data.projekte.map((p) => (p.id === projekt.id ? projekt : p))
        : [...data.projekte, projekt],
    });
    setBearbeitung(null);
  }

  function loescheProjekt(id: string) {
    const bestaetigt = window.confirm('Projekt wirklich löschen?');
    if (!bestaetigt) return;
    updateData({ ...data, projekte: data.projekte.filter((p) => p.id !== id) });
    setBearbeitung(null);
  }

  function statusAendern(projekt: Projekt, richtung: -1 | 1) {
    const index = SPALTEN.indexOf(projekt.status);
    const neuerIndex = index + richtung;
    if (neuerIndex < 0 || neuerIndex >= SPALTEN.length) return;
    speichereProjekt({ ...projekt, status: SPALTEN[neuerIndex] });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Projekte</h1>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {SPALTEN.map((spalte, spaltenIndex) => {
          const projekteDerSpalte = data.projekte.filter((p) => p.status === spalte);
          return (
            <div
              key={spalte}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <h2 className="mb-3 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                {SPALTEN_LABEL[spalte]}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-800">
                  {projekteDerSpalte.length}
                </span>
              </h2>

              <div className="flex flex-col gap-3">
                {projekteDerSpalte.map((projekt) => {
                  const fortschritt = berechneFortschritt(projekt);
                  return (
                    <div
                      key={projekt.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <button
                        type="button"
                        onClick={() => setBearbeitung(projekt)}
                        className="w-full text-left"
                      >
                        <p className="font-medium">{projekt.titel}</p>
                        {modulName(projekt.modulId) && (
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {modulName(projekt.modulId)}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Deadline: {formatiereDatumKurz(projekt.deadline)}
                        </p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${fortschritt.prozent}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {fortschritt.erledigt}/{fortschritt.gesamt} Tasks erledigt (
                          {fortschritt.prozent}%)
                        </p>
                      </button>

                      <div className="mt-2 flex justify-between">
                        <button
                          type="button"
                          disabled={spaltenIndex === 0}
                          onClick={() => statusAendern(projekt, -1)}
                          className="rounded px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:invisible dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          ← {SPALTEN_LABEL[SPALTEN[spaltenIndex - 1] ?? spalte]}
                        </button>
                        <button
                          type="button"
                          disabled={spaltenIndex === SPALTEN.length - 1}
                          onClick={() => statusAendern(projekt, 1)}
                          className="rounded px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:invisible dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          {SPALTEN_LABEL[SPALTEN[spaltenIndex + 1] ?? spalte]} →
                        </button>
                      </div>
                    </div>
                  );
                })}

                {projekteDerSpalte.length === 0 && (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                    Keine Projekte
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setBearbeitung(spalte)}
                className="mt-3 w-full rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                + Projekt
              </button>
            </div>
          );
        })}
      </div>

      {bearbeitung && (
        <Modal
          titel={typeof bearbeitung === 'string' ? 'Neues Projekt' : 'Projekt bearbeiten'}
          onClose={() => setBearbeitung(null)}
        >
          <ProjektForm
            bearbeitetesProjekt={typeof bearbeitung === 'string' ? undefined : bearbeitung}
            vorgabeStatus={typeof bearbeitung === 'string' ? bearbeitung : undefined}
            module={data.module}
            onSubmit={speichereProjekt}
            onCancel={() => setBearbeitung(null)}
            onDelete={
              typeof bearbeitung === 'string' ? undefined : () => loescheProjekt(bearbeitung.id)
            }
          />
        </Modal>
      )}
    </div>
  );
}
