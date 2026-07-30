import type { AppData } from '../types';

export const CURRENT_SCHEMA_VERSION = 1;

export function leereAppData(): AppData {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    module: [],
    termine: [],
    projekte: [],
  };
}

/**
 * Promise-basiertes Interface, damit ein späterer Wechsel auf SQLite/Supabase
 * ohne Änderungen an den Aufrufstellen möglich ist (siehe DECISIONS.md).
 */
export interface StudyRepository {
  load(): Promise<AppData>;
  save(data: AppData): Promise<void>;
  reset(): Promise<AppData>;
}
