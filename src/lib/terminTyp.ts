import type { TerminTyp } from '../types';

interface TypFarbe {
  badge: string;
  dot: string;
}

const FARBEN: Record<TerminTyp, TypFarbe> = {
  Vorlesung: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  Prüfung: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    dot: 'bg-red-500',
  },
  Abgabe: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Sonstiges: {
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-500',
  },
};

export const PROJEKT_DEADLINE_FARBE: TypFarbe = {
  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  dot: 'bg-violet-500',
};

export function terminTypFarbe(typ: TerminTyp): TypFarbe {
  return FARBEN[typ];
}
