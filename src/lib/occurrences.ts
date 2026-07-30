import type { Termin } from '../types';

export interface Occurrence {
  occurrenceId: string;
  terminId: string;
  titel: string;
  start: Date;
  typ: Termin['typ'];
  modulId?: string;
  ort?: string;
  notiz?: string;
}

export interface Zeitraum {
  start: Date;
  ende: Date;
}

/**
 * Einziger erlaubter Lesezugriff auf `Termin[]` (siehe DECISIONS.md). Heute
 * ein reiner Zeitraum-Filter; da `recurrence` aktuell ausschliesslich `null`
 * ist, entspricht jedem Termin genau ein Vorkommen. Später der Ort für
 * Recurrence-Expansion und `.ics`-Import, ohne dass Views sich ändern müssen.
 */
export function expandOccurrences(termine: Termin[], zeitraum: Zeitraum): Occurrence[] {
  return termine
    .map((termin) => ({ termin, start: new Date(termin.datumZeit) }))
    .filter(({ start }) => start >= zeitraum.start && start <= zeitraum.ende)
    .map(({ termin, start }) => ({
      occurrenceId: termin.id,
      terminId: termin.id,
      titel: termin.titel,
      start,
      typ: termin.typ,
      modulId: termin.modulId,
      ort: termin.ort,
      notiz: termin.notiz,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
