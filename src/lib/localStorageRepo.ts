import type { AppData } from '../types';
import { CURRENT_SCHEMA_VERSION, leereAppData, type StudyRepository } from './repository';
import { erzeugeBeispieldaten } from './sampleData';

const STORAGE_KEY = 'studien-dashboard:data';

function schreiben(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createLocalStorageRepo(): StudyRepository {
  return {
    async load() {
      const gespeichert = localStorage.getItem(STORAGE_KEY);

      if (!gespeichert) {
        const beispieldaten = erzeugeBeispieldaten();
        schreiben(beispieldaten);
        return beispieldaten;
      }

      const daten = JSON.parse(gespeichert) as AppData;
      if (daten.schemaVersion !== CURRENT_SCHEMA_VERSION) {
        throw new Error(
          `Unbekannte schemaVersion "${daten.schemaVersion}" (erwartet: ${CURRENT_SCHEMA_VERSION}).`,
        );
      }
      return daten;
    },

    async save(data) {
      schreiben(data);
    },

    async reset() {
      const leer = leereAppData();
      schreiben(leer);
      return leer;
    },
  };
}
