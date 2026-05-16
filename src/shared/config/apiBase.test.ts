describe('getApiBase', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env;
  });

  it('returns /api at site root', async () => {
    process.env.BASE_URL = '/';
    process.env.VITE_API_URL = '/api';
    const { getApiBase } = await import('./apiBase');
    expect(getApiBase()).toBe('/api');
  });

  it('prefixes API with repository base path (GitHub Pages)', async () => {
    process.env.BASE_URL = '/recipe-spa/';
    process.env.VITE_API_URL = '/api';
    const { getApiBase } = await import('./apiBase');
    expect(getApiBase()).toBe('/recipe-spa/api');
  });
});
