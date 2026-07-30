import type { Projekt } from '../types';

export interface ProjektFortschritt {
  erledigt: number;
  gesamt: number;
  prozent: number;
}

/** Fortschritt wird bewusst nicht gespeichert, sondern aus den Tasks berechnet
 *  (siehe DECISIONS.md) — vermeidet inkonsistente Werte zwischen Tasks und
 *  gespeichertem Fortschritt. */
export function berechneFortschritt(projekt: Projekt): ProjektFortschritt {
  const gesamt = projekt.tasks.length;
  const erledigt = projekt.tasks.filter((t) => t.erledigt).length;
  return { erledigt, gesamt, prozent: gesamt === 0 ? 0 : Math.round((erledigt / gesamt) * 100) };
}
