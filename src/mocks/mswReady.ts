/** Резолвится, когда MSW готов (или не используется / не удалось запустить). */
let resolveReady: (() => void) | null = null;

export const whenMswReady: Promise<void> =
  process.env.VITE_ENABLE_MSW === 'true'
    ? new Promise<void>((resolve) => {
        resolveReady = resolve;
      })
    : Promise.resolve();

export function notifyMswReady(): void {
  resolveReady?.();
  resolveReady = null;
}
