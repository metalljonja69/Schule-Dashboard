import { useEffect, useState } from 'react';
import { useStudyData } from '../context/StudyDataContext';
import type { Termin } from '../types';
import { Modal } from './Modal';
import { TerminForm } from './TerminForm';

function inEingabefeld(ziel: EventTarget | null): boolean {
  if (!(ziel instanceof HTMLElement)) return false;
  if (ziel.isContentEditable) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(ziel.tagName);
}

export function QuickAddTermin() {
  const { data, updateData } = useStudyData();
  const [offen, setOffen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (inEingabefeld(e.target)) return;

      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOffen(true);
        return;
      }

      // Cmd/Ctrl+K: Platzhalter für Command Palette, vorerst ohne Funktion (siehe DECISIONS.md).
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function speichereTermin(termin: Termin) {
    updateData({ ...data, termine: [...data.termine, termin] });
    setOffen(false);
  }

  if (!offen) return null;

  return (
    <Modal titel="Neuer Termin (Schnellanlage)" onClose={() => setOffen(false)}>
      <TerminForm
        module={data.module}
        onSubmit={speichereTermin}
        onCancel={() => setOffen(false)}
      />
    </Modal>
  );
}
