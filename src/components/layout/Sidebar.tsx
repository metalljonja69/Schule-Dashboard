import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Übersicht', end: true },
  { to: '/module', label: 'Module' },
  { to: '/kalender', label: 'Kalender' },
  { to: '/projekte', label: 'Projekte' },
];

interface SidebarProps {
  offen: boolean;
  onNavigiert: () => void;
}

export function Sidebar({ offen, onNavigiert }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-slate-200 bg-white p-4 transition-transform duration-200 md:static md:w-60 md:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
        offen ? 'translate-x-0' : ''
      }`}
    >
      <div className="mb-6 px-2">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          BSc Wirtschaftsinformatik
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">ZHAW · Semester 1 von 6</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigiert}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-4 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {theme === 'dark' ? '☀️ Heller Modus' : '🌙 Dunkler Modus'}
      </button>
    </aside>
  );
}
