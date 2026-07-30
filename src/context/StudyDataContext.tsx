import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { AppData } from '../types';
import { createLocalStorageRepo } from '../lib/localStorageRepo';

type State =
  { status: 'loading' } | { status: 'ready'; data: AppData } | { status: 'error'; message: string };

type Action =
  | { type: 'loaded'; data: AppData }
  | { type: 'updated'; data: AppData }
  | { type: 'error'; message: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
    case 'updated':
      return { status: 'ready', data: action.data };
    case 'error':
      return { status: 'error', message: action.message };
  }
}

interface StudyDataContextValue {
  data: AppData;
  updateData: (next: AppData) => void;
  resetData: () => void;
}

const StudyDataContext = createContext<StudyDataContextValue | null>(null);

export function StudyDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'loading' });
  const repository = useMemo(() => createLocalStorageRepo(), []);

  useEffect(() => {
    let abgebrochen = false;

    repository
      .load()
      .then((data) => {
        if (!abgebrochen) dispatch({ type: 'loaded', data });
      })
      .catch((error: unknown) => {
        if (!abgebrochen) {
          const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
          dispatch({ type: 'error', message });
        }
      });

    return () => {
      abgebrochen = true;
    };
  }, [repository]);

  const updateData = useCallback(
    (next: AppData) => {
      dispatch({ type: 'updated', data: next });
      void repository.save(next);
    },
    [repository],
  );

  const resetData = useCallback(() => {
    void repository.reset().then((leer) => dispatch({ type: 'updated', data: leer }));
  }, [repository]);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">
        Lade Daten…
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Fehler beim Laden der Daten: {state.message}
      </div>
    );
  }

  const value: StudyDataContextValue = { data: state.data, updateData, resetData };

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export function useStudyData(): StudyDataContextValue {
  const context = useContext(StudyDataContext);
  if (!context) {
    throw new Error('useStudyData muss innerhalb von StudyDataProvider verwendet werden');
  }
  return context;
}
