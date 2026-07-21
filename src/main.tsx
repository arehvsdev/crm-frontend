import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>,
);
