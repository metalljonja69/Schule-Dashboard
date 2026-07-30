import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { StudyDataProvider } from './context/StudyDataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <StudyDataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StudyDataProvider>
    </ThemeProvider>
  </StrictMode>,
);
