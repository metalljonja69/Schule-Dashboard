import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOffen, setSidebarOffen] = useState(false);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar offen={sidebarOffen} onNavigiert={() => setSidebarOffen(false)} />

      {sidebarOffen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOffen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white p-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setSidebarOffen(true)}
            aria-label="Menü öffnen"
            className="rounded-md border border-slate-300 px-2.5 py-1.5 dark:border-slate-700"
          >
            ☰
          </button>
          <span className="font-semibold">Studien-Dashboard</span>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
