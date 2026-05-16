import axios, { type AxiosError } from 'axios';
import { getApiBase } from '@/shared/config/apiBase';
import { whenMswReady } from '@/mocks/mswReady';

const baseURL = getApiBase();

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const TOKEN_KEY = 'recipe_spa_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

apiClient.interceptors.request.use(async (config) => {
  if (process.env.VITE_ENABLE_MSW === 'true') {
    await whenMswReady;
  }
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    if (status === 401) {
      setStoredToken(null);
      window.dispatchEvent(new CustomEvent('recipe-spa:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export type ApiErrorShape = {
  message: string;
  status?: number;
};

export function toApiError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const msg =
      error.response?.data?.message ??
      error.message ??
      'Произошла ошибка сети';
    return { message: msg, status: error.response?.status };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Неизвестная ошибка' };
}
