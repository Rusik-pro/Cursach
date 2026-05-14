import { memo, useCallback, useEffect, useState, type ReactElement } from 'react';
import type { Recipe } from '@/entities/recipe/model/types';
import { fetchRecipes } from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import { RECIPE_CATEGORIES } from '@/shared/config/categories';
import { useRecipeFilters } from '@/shared/lib/useRecipeFilters';
import { RecipeCard } from '@/widgets/recipe-card/ui/RecipeCard';
import styles from './RecipesPage.module.css';

export const RecipesPage = memo(function RecipesPage(): ReactElement {
  const { q, setQ, category, setCategory, ingredient, setIngredient, maxPrepTime, setMaxPrepTime, filters } =
    useRecipeFilters();
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchRecipes(filters));
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className={styles.catalog}>
      <header className={styles.catalog__header}>
        <h1 className={styles.catalog__title}>Каталог рецептов</h1>
        <p className={styles.catalog__lead}>Поиск по названию и фильтры по атрибутам.</p>
      </header>

      <div className={styles.catalog__filters}>
        <label className={styles.catalog__field}>
          <span>Поиск</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Название" />
        </label>
        <label className={styles.catalog__field}>
          <span>Категория</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Все</option>
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.catalog__field}>
          <span>Ингредиент</span>
          <input
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Например: молоко"
          />
        </label>
        <label className={styles.catalog__field}>
          <span>Макс. время (мин)</span>
          <input
            type="number"
            min={5}
            step={5}
            value={maxPrepTime === '' ? '' : maxPrepTime}
            onChange={(e) => {
              const v = e.target.value;
              setMaxPrepTime(v === '' ? '' : Number(v));
            }}
          />
        </label>
      </div>

      {loading ? <p className={styles.catalog__state}>Загрузка…</p> : null}
      {error ? <p className={styles.catalog__error}>{error}</p> : null}

      {!loading && !error ? (
        <div className={styles.catalog__grid}>
          {items.length === 0 ? (
            <p className={styles.catalog__state}>Ничего не найдено — измените фильтры.</p>
          ) : (
            items.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} index={index} />)
          )}
        </div>
      ) : null}
    </section>
  );
});
