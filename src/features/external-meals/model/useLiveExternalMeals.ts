import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ExternalMealPreview } from '@/shared/api/themealdbTypes';
import { ThemealdbService } from '@/shared/api/themealdbService';

const DEFAULT_THEMEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

function parseRefreshMs(): number {
  const raw = process.env.VITE_THEMEALDB_REFRESH_MS;
  const n = raw !== undefined && raw !== '' ? Number(raw) : NaN;
  if (Number.isFinite(n) && n >= 5000) {
    return Math.floor(n);
  }
  return 25_000;
}

export function useLiveExternalMeals(desiredCount = 6): {
  items: ExternalMealPreview[];
  loading: boolean;
  error: string | null;
  lastUpdatedAt: Date | null;
  refresh: () => void;
} {
  const [items, setItems] = useState<ExternalMealPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const aliveRef = useRef(true);
  const genRef = useRef(0);
  const baseUrl = process.env.VITE_THEMEALDB_BASE_URL || DEFAULT_THEMEALDB_BASE;
  const service = useMemo(() => new ThemealdbService(baseUrl), [baseUrl]);

  const refreshMs = useMemo(() => parseRefreshMs(), []);

  const load = useCallback(
    async (mode: 'full' | 'quiet' = 'full') => {
      const myGen = ++genRef.current;
      if (mode === 'full') {
        setLoading(true);
      }
      setError(null);
      try {
        const data = await service.fetchRandomMealsUnique(desiredCount);
        if (!aliveRef.current || myGen !== genRef.current) {
          return;
        }
        setItems(data);
        setLastUpdatedAt(new Date());
      } catch (e) {
        if (!aliveRef.current || myGen !== genRef.current) {
          return;
        }
        const msg = e instanceof Error ? e.message : 'Ошибка загрузки TheMealDB';
        setError(msg);
      } finally {
        if (aliveRef.current && myGen === genRef.current && mode === 'full') {
          setLoading(false);
        }
      }
    },
    [desiredCount, service]
  );

  useEffect(() => {
    aliveRef.current = true;
    void load('full');

    const intervalId = window.setInterval(() => {
      void load('quiet');
    }, refreshMs);

    const onVisible = (): void => {
      if (document.visibilityState === 'visible') {
        void load('quiet');
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      aliveRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load, refreshMs]);

  return {
    items,
    loading,
    error,
    lastUpdatedAt,
    refresh: () => {
      void load('full');
    },
  };
}
