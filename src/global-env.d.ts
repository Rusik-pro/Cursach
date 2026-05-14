declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    /** Публичный префикс приложения (как Vite BASE_URL), всегда со слэшем в конце */
    readonly BASE_URL: string;
    readonly VITE_API_URL: string;
    readonly VITE_ENABLE_MSW: string;
    readonly VITE_BASE_PATH: string;
    readonly VITE_THEMEALDB_BASE_URL: string;
    readonly VITE_THEMEALDB_REFRESH_MS: string;
  }
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css';
