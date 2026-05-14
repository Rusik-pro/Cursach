import { memo, useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Recipe } from '@/entities/recipe/model/types';
import {
  deleteRecipe,
  fetchFavorites,
  fetchRecipe,
} from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import { useAuth } from '@/features/auth/model/AuthContext';
import { FavoriteToggle } from '@/features/favorites/ui/FavoriteToggle';
import styles from './RecipeDetailPage.module.css';

export const RecipeDetailPage = memo(function RecipeDetailPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAuthor = useMemo(
    () => Boolean(user && recipe && recipe.author.id === user.id),
    [recipe, user]
  );

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecipe(id);
      setRecipe(data);
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!token || !id) {
      setFavorite(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const list = await fetchFavorites();
        if (!cancelled) {
          setFavorite(list.some((r) => r.id === id));
        }
      } catch {
        if (!cancelled) setFavorite(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const onDelete = useCallback(async () => {
    if (!id || !recipe || !window.confirm('Удалить рецепт безвозвратно?')) return;
    setDeleting(true);
    try {
      await deleteRecipe(id);
      navigate('/recipes', { replace: true });
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setDeleting(false);
    }
  }, [id, navigate, recipe]);

  if (!id) {
    return <p className={styles.detail__state}>Не указан идентификатор.</p>;
  }

  if (loading) {
    return <p className={styles.detail__state}>Загрузка…</p>;
  }

  if (error || !recipe) {
    return (
      <div className={styles.detail}>
        <p className={styles.detail__error}>{error ?? 'Рецепт не найден'}</p>
        <Link to="/recipes">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <article className={styles.detail}>
      <header className={styles.detail__header}>
        <div>
          <p className={styles.detail__crumb}>
            <Link to="/recipes">Каталог</Link> / {recipe.category}
          </p>
          <h1 className={styles.detail__title}>{recipe.title}</h1>
          <p className={styles.detail__meta}>
            {recipe.prepTimeMinutes} мин · Сложность: {recipe.difficulty} · Автор: {recipe.author.name}
          </p>
        </div>
        <div className={styles.detail__actions}>
          {token ? <FavoriteToggle recipeId={recipe.id} initialActive={favorite} /> : null}
          {isAuthor ? (
            <>
              <Link className={styles.detail__edit} to={`/recipes/${recipe.id}/edit`}>
                Редактировать
              </Link>
              <button
                type="button"
                className={styles.detail__delete}
                onClick={() => void onDelete()}
                disabled={deleting}
              >
                {deleting ? 'Удаление…' : 'Удалить'}
              </button>
            </>
          ) : null}
        </div>
      </header>

      <div className={styles.detail__layout}>
        <div className={styles.detail__media}>
          {recipe.imageUrl ? (
            <img className={styles.detail__image} src={recipe.imageUrl} alt="" loading="lazy" />
          ) : (
            <div className={styles.detail__placeholder}>Нет изображения</div>
          )}
        </div>
        <section className={styles.detail__section}>
          <h2>Ингредиенты</h2>
          <ul className={styles.detail__list}>
            {recipe.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </section>
        <section className={styles.detail__section}>
          <h2>Шаги приготовления</h2>
          <ol className={styles.detail__steps}>
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
});
