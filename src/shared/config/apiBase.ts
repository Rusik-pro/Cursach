/**
 * Базовый путь API с учётом GitHub Pages (подкаталог репозитория).
 * Пример: BASE_URL=/recipe-spa/, VITE_API_URL=/api → /recipe-spa/api
 */
export function getApiBase(): string {
  const configured = process.env.VITE_API_URL || '/api';
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured.replace(/\/$/, '');
  }

  const base = process.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const apiPart = configured.startsWith('/') ? configured : `/${configured}`;

  if (!normalizedBase || normalizedBase === '/') {
    return apiPart;
  }

  return `${normalizedBase}${apiPart}`.replace(/\/+/g, '/');
}
