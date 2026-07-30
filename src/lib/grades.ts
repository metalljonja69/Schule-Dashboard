import type { Modul } from '../types';

export interface Notendurchschnitt {
  schnitt: number | null;
  anzahlBestandeneEinbezogen: number;
  anzahlLaufendeEinbezogen: number;
  ectsEinbezogen: number;
}

/**
 * Gewichteter Notendurchschnitt (siehe DECISIONS.md): Es zählen Module mit
 * Status `bestanden` sowie `laufend` mit gesetzter Zwischennote; `nicht
 * bestanden` zählt nie. `nurBestandene` blendet die laufenden Module aus.
 */
export function berechneNotendurchschnitt(
  module: Modul[],
  nurBestandene: boolean,
): Notendurchschnitt {
  const relevante = module.filter((m) => {
    if (m.note == null) return false;
    if (m.status === 'bestanden') return true;
    if (m.status === 'laufend') return !nurBestandene;
    return false;
  });

  const ectsEinbezogen = relevante.reduce((summe, m) => summe + m.ects, 0);
  const anzahlLaufendeEinbezogen = relevante.filter((m) => m.status === 'laufend').length;
  const anzahlBestandeneEinbezogen = relevante.filter((m) => m.status === 'bestanden').length;

  if (ectsEinbezogen === 0) {
    return { schnitt: null, anzahlBestandeneEinbezogen, anzahlLaufendeEinbezogen, ectsEinbezogen };
  }

  const gewichteteSumme = relevante.reduce((summe, m) => summe + m.note! * m.ects, 0);
  return {
    schnitt: gewichteteSumme / ectsEinbezogen,
    anzahlBestandeneEinbezogen,
    anzahlLaufendeEinbezogen,
    ectsEinbezogen,
  };
}
