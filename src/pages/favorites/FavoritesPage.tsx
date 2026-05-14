import { memo, useCallback, useEffect, useState, type ReactElement } from 'react';
import type { Recipe } from '@/entities/recipe/model/types';
import { fetchFavorites } from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import { RecipeCard } from '@/widgets/recipe-card/ui/RecipeCard';
import styles from './FavoritesPage.module.css';

export const FavoritesPage = memo(function FavoritesPage(): ReactElement {
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchFavorites());
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className={styles.fav}>
      <header className={styles.fav__header}>
        <h1 className={styles.fav__title}>Избранное</h1>
        <p className={styles.fav__lead}>Рецепты, которые вы сохранили в личный список.</p>
      </header>
      {loading ? <p className={styles.fav__state}>Загрузка…</p> : null}
      {error ? <p className={styles.fav__error}>{error}</p> : null}
      {!loading && !error ? (
        <div className={styles.fav__grid}>
          {items.length === 0 ? (
            <p className={styles.fav__state}>Пока пусто — добавьте рецепты со страницы блюда.</p>
          ) : (
            items.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} index={index} />)
          )}
        </div>
      ) : null}
    </section>
  );
});
