import type {
  ExternalMealPreview,
  ThemealDbMealDto,
  ThemealDbRandomResponse,
} from '@/shared/api/themealdbTypes';

const DEFAULT_BASE = 'https://www.themealdb.com/api/json/v1/1';

function mealHref(dto: ThemealDbMealDto): string {
  if (dto.strSource && /^https?:\/\//i.test(dto.strSource)) {
    return dto.strSource;
  }
  return `https://www.themealdb.com/meal.php?c=${encodeURIComponent(dto.idMeal)}`;
}

export function mapThemealDbMealToPreview(dto: ThemealDbMealDto): ExternalMealPreview {
  return {
    id: dto.idMeal,
    title: dto.strMeal,
    category: dto.strCategory ?? '—',
    area: dto.strArea ?? '—',
    thumbUrl: dto.strMealThumb,
    href: mealHref(dto),
  };
}

/**
 * Клиент внешнего API TheMealDB: отдельный от axios apiClient,
 * чтобы не отправлять Bearer-токен на сторонний домен.
 */
export class ThemealdbService {
  constructor(private readonly baseUrl: string = DEFAULT_BASE) {}

  private async fetchOneRandom(signal?: AbortSignal): Promise<ThemealDbMealDto | null> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/random.php`;
    const res = await fetch(url, { signal, method: 'GET' });
    if (!res.ok) {
      throw new Error(`TheMealDB: ${res.status} ${res.statusText}`);
    }
    const json = (await res.json()) as ThemealDbRandomResponse;
    const meal = json.meals?.[0];
    return meal ?? null;
  }

  /** Несколько разных блюд за счёт повторных запросов random.php. */
  async fetchRandomMealsUnique(count: number, signal?: AbortSignal): Promise<ExternalMealPreview[]> {
    const byId = new Map<string, ExternalMealPreview>();
    const maxAttempts = Math.max(count * 10, count + 5);
    let attempts = 0;
    while (byId.size < count && attempts < maxAttempts) {
      attempts += 1;
      const meal = await this.fetchOneRandom(signal);
      if (meal && !byId.has(meal.idMeal)) {
        byId.set(meal.idMeal, mapThemealDbMealToPreview(meal));
      }
    }
    return [...byId.values()].slice(0, count);
  }
}
