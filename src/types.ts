export type ModulStatus = 'geplant' | 'laufend' | 'bestanden' | 'nicht bestanden';

export interface Modul {
  id: string;
  name: string;
  code: string;
  ects: number;
  semester: number;
  status: ModulStatus;
  /** Skala 1.0–6.0 in Schritten von 0.25, bestanden ab 4.0. */
  note?: number;
  dozent?: string;
}

export type TerminTyp = 'Vorlesung' | 'Prüfung' | 'Abgabe' | 'Sonstiges';

export type RecurrenceFrequenz = 'täglich' | 'wöchentlich' | 'monatlich';

export interface RecurrenceRule {
  frequenz: RecurrenceFrequenz;
  intervall: number;
  /** ISO-Datum, letztes Vorkommen inklusive. */
  bisEinschliesslich?: string;
}

export interface Termin {
  id: string;
  titel: string;
  /** ISO-8601-String, Formatierung erst in der View (Locale de-CH, Zeitzone Europe/Zurich). */
  datumZeit: string;
  typ: TerminTyp;
  modulId?: string;
  ort?: string;
  notiz?: string;
  /**
   * Aktuell wird ausschliesslich `null` unterstützt (siehe DECISIONS.md).
   * Das Feld existiert bereits, damit später Recurrence-Expansion und
   * .ics-Import ohne Breaking Change ergänzt werden können.
   */
  recurrence?: RecurrenceRule | null;
}

export type ProjektStatus = 'geplant' | 'laufend' | 'abgeschlossen';

export interface ProjektTask {
  id: string;
  titel: string;
  erledigt: boolean;
}

export interface Projekt {
  id: string;
  titel: string;
  modulId?: string;
  /** ISO-Datum. */
  deadline: string;
  status: ProjektStatus;
  tasks: ProjektTask[];
}

export interface AppData {
  schemaVersion: number;
  module: Modul[];
  termine: Termin[];
  projekte: Projekt[];
}
