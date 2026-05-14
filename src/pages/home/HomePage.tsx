import { memo, useCallback, useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/entities/recipe/model/types';
import { LiveExternalMeals } from '@/features/external-meals/ui/LiveExternalMeals';
import { fetchLatestRecipes } from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import { RecipeCard } from '@/widgets/recipe-card/ui/RecipeCard';
import styles from './HomePage.module.css';

export const HomePage = memo(function HomePage(): ReactElement {
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchLatestRecipes(6));
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
    <section className={styles.home}>
      <header className={styles.home__header}>
        <div>
          <h1 className={styles.home__title}>Дашборд</h1>
          <p className={styles.home__lead}>
            Последние добавленные рецепты. Используйте поиск и фильтры в каталоге.
          </p>
        </div>
        <Link className={styles.home__cta} to="/recipes">
          Открыть каталог
        </Link>
      </header>
      {loading ? <p className={styles.home__state}>Загрузка…</p> : null}
      {error ? <p className={styles.home__error}>{error}</p> : null}
      {!loading && !error ? (
        <div className={styles.home__grid}>
          {items.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      ) : null}

      <LiveExternalMeals />
    </section>
  );
});
