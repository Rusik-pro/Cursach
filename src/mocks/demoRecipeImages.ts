/**
 * Обложки демо-рецептов (MSW / без бэкенда).
 * Замените URL на свои или положите файлы в `public/recipes/` и укажите `/recipes/имя.jpg`.
 *
 * Важно: у Unsplash ID фото строго фиксированы — произвольная строка даёт 404 и картинка не грузится.
 */
export const demoRecipeImages = {
  borscht:
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&h=600&q=80',
  porridge:
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&h=600&q=80',
  tiramisu:
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&h=600&q=80',
  smoothie:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&h=600&q=80',
} as const;
