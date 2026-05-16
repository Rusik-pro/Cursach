import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';

async function bootstrap(): Promise<void> {
  if (process.env.VITE_ENABLE_MSW === 'true') {
    try {
      const { worker } = await import('./mocks/browser');
      const baseUrl = process.env.BASE_URL || '/';
      await worker.start({
        serviceWorker: {
          url: `${baseUrl}mockServiceWorker.js`,
          options: { scope: baseUrl },
        },
        onUnhandledRequest: 'bypass',
      });
    } catch (err) {
      console.warn('[recipe-spa] MSW не запустился — интерфейс откроется, API может не работать:', err);
    }
  }

  const root = document.getElementById('root');
  if (!root) {
    console.error('[recipe-spa] Элемент #root не найден');
    return;
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

void bootstrap();
