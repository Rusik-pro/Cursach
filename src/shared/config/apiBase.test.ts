import { getApiBase } from './apiBase';

describe('getApiBase', () => {
  const savedEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('returns /api at site root', () => {
    process.env.BASE_URL = '/';
    process.env.VITE_API_URL = '/api';
    expect(getApiBase()).toBe('/api');
  });

  it('prefixes API with repository base path (GitHub Pages)', () => {
    process.env.BASE_URL = '/recipe-spa/';
    process.env.VITE_API_URL = '/api';
    expect(getApiBase()).toBe('/recipe-spa/api');
  });
});
