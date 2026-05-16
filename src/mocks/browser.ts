import { setupWorker } from 'msw/browser';
import { createHandlers } from '@/mocks/handlers';

export const worker = setupWorker(...createHandlers());
