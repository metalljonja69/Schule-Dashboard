import { addDays, setHours, setMinutes } from 'date-fns';
import { createId } from './id';
import { CURRENT_SCHEMA_VERSION } from './repository';
import type { AppData, Modul, Projekt, Termin } from '../types';

function amTagUm(tageAbHeute: number, stunde: number, minute: number): string {
  const datum = setMinutes(setHours(addDays(new Date(), tageAbHeute), stunde), minute);
  return datum.toISOString();
}

export function erzeugeBeispieldaten(): AppData {
  const mathematik: Modul = {
    id: createId(),
    name: 'Mathematik 1',
    code: 't.BA.WIN.MATH1',
    ects: 4,
    semester: 1,
    status: 'laufend',
    note: 5.0,
    dozent: 'Prof. Dr. Keller',
  };

  const programmieren: Modul = {
    id: createId(),
    name: 'Programmieren 1',
    code: 't.BA.WIN.PROG1',
    ects: 4,
    semester: 1,
    status: 'laufend',
    dozent: 'M. Frei',
  };

  const wirtschaftUndRecht: Modul = {
    id: createId(),
    name: 'Wirtschaft und Recht 1',
    code: 't.BA.WIN.WNR1',
    ects: 3,
    semester: 1,
    status: 'bestanden',
    note: 4.5,
    dozent: 'Dr. S. Meier',
  };

  const module: Modul[] = [mathematik, programmieren, wirtschaftUndRecht];

  const termine: Termin[] = [
    {
      id: createId(),
      titel: 'Vorlesung Mathematik 1',
      datumZeit: amTagUm(1, 8, 15),
      typ: 'Vorlesung',
      modulId: mathematik.id,
      ort: 'SR 3.05',
      notiz: '',
      recurrence: null,
    },
    {
      id: createId(),
      titel: 'Abgabe Übung 3 – Programmieren 1',
      datumZeit: amTagUm(4, 23, 59),
      typ: 'Abgabe',
      modulId: programmieren.id,
      ort: '',
      notiz: 'Code und Kurzbericht hochladen',
      recurrence: null,
    },
    {
      id: createId(),
      titel: 'Prüfung Mathematik 1',
      datumZeit: amTagUm(10, 9, 0),
      typ: 'Prüfung',
      modulId: mathematik.id,
      ort: 'Aula',
      notiz: 'Hilfsmittel: Taschenrechner, keine Unterlagen',
      recurrence: null,
    },
    {
      id: createId(),
      titel: 'Semester-Infoanlass',
      datumZeit: amTagUm(20, 17, 0),
      typ: 'Sonstiges',
      ort: 'Aula',
      notiz: '',
      recurrence: null,
    },
  ];

  const projekte: Projekt[] = [
    {
      id: createId(),
      titel: 'Programmierprojekt: Taschenrechner-App',
      modulId: programmieren.id,
      deadline: amTagUm(14, 23, 59),
      status: 'laufend',
      tasks: [
        { id: createId(), titel: 'Anforderungen klären', erledigt: true },
        { id: createId(), titel: 'UI umsetzen', erledigt: true },
        { id: createId(), titel: 'Tests schreiben', erledigt: false },
        { id: createId(), titel: 'Dokumentation schreiben', erledigt: false },
      ],
    },
  ];

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    module,
    termine,
    projekte,
  };
}
