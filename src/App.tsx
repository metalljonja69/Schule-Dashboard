import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewView } from './views/OverviewView';
import { ModulesView } from './views/ModulesView';
import { CalendarView } from './views/CalendarView';
import { ProjectsView } from './views/ProjectsView';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewView />} />
        <Route path="/module" element={<ModulesView />} />
        <Route path="/kalender" element={<CalendarView />} />
        <Route path="/projekte" element={<ProjectsView />} />
      </Routes>
    </AppShell>
  );
}

export default App;
