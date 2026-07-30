import type { AppData } from '../types';
import { CURRENT_SCHEMA_VERSION } from './repository';

export function exportiereAlsDatei(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const datum = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `studien-dashboard-backup-${datum}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function istAppDataForm(wert: unknown): wert is AppData {
  return (
    typeof wert === 'object' &&
    wert !== null &&
    'schemaVersion' in wert &&
    'module' in wert &&
    'termine' in wert &&
    'projekte' in wert
  );
}

/** Wirft bei ungültigem JSON oder unbekannter schemaVersion (siehe DECISIONS.md). */
export function parseImportiertesJson(text: string): AppData {
  let geparst: unknown;
  try {
    geparst = JSON.parse(text);
  } catch {
    throw new Error('Datei ist kein gültiges JSON.');
  }

  if (!istAppDataForm(geparst)) {
    throw new Error('Datei entspricht nicht dem erwarteten Format (AppData).');
  }

  if (geparst.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Unbekannte schemaVersion "${geparst.schemaVersion}" (erwartet: ${CURRENT_SCHEMA_VERSION}).`,
    );
  }

  return geparst;
}
