import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { notifyMswReady } from '@/mocks/mswReady';

function renderApp(): void {
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

async function initMsw(): Promise<void> {
  if (process.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const baseUrl = process.env.BASE_URL || '/';

  const startWorker = async (): Promise<void> => {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {
        url: `${baseUrl}mockServiceWorker.js`,
        options: { scope: baseUrl },
      },
      onUnhandledRequest: 'bypass',
    });
  };

  try {
    await Promise.race([
      startWorker(),
      new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error('MSW start timeout (8s)')), 8000);
      }),
    ]);
  } catch (err) {
    console.warn('[recipe-spa] MSW не запустился — API может быть недоступен:', err);
  } finally {
    notifyMswReady();
  }
}

async function bootstrap(): Promise<void> {
  void initMsw();
  renderApp();
}

void bootstrap();
