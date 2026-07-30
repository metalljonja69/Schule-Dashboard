import { ZEITZONE } from './constants';

/**
 * Formatierung erfolgt unabhängig von der Zeitzone des Betrachtungsgeräts
 * immer für Europe/Zurich (siehe DECISIONS.md), über die native Intl-API —
 * date-fns kennt kein "de-CH"-Locale und keine Zeitzonen-Konvertierung.
 */
function formatierer(optionen: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('de-CH', { timeZone: ZEITZONE, ...optionen });
}

export function formatiereDatumKurz(iso: string): string {
  return formatierer({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}

export function formatiereWochentagUndDatum(iso: string): string {
  return formatierer({ weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date(iso));
}

export function formatiereUhrzeit(iso: string): string {
  return formatierer({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export function formatiereDatumZeit(iso: string): string {
  return `${formatiereWochentagUndDatum(iso)}, ${formatiereUhrzeit(iso)}`;
}

export function formatiereMonatUndJahr(datum: Date): string {
  return formatierer({ month: 'long', year: 'numeric' }).format(datum);
}

/**
 * Kalendertag (YYYY-MM-DD) eines Zeitpunkts, ausgewertet in Europe/Zurich.
 * Dient zum Gruppieren von Terminen nach Tag, unabhängig von der lokalen
 * Zeitzone des Betrachtungsgeräts.
 */
export function zurichTagesSchluessel(datum: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZEITZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(datum);
}
