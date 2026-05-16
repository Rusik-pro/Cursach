/** Минимальные типы Node для Jest (без @types/node в зависимостях). */
export {};

declare global {
  // eslint-disable-next-line no-var
  var process: {
    env: Record<string, string | undefined>;
  };
}
