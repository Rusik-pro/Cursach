import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactElement,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { RecipeDifficulty } from '@/entities/recipe/model/types';
import { createRecipe, fetchRecipe, updateRecipe } from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import { RECIPE_CATEGORIES } from '@/shared/config/categories';
import styles from './RecipeFormPage.module.css';

type FormState = {
  title: string;
  category: string;
  ingredients: string;
  prepTimeMinutes: number;
  difficulty: RecipeDifficulty;
  steps: string;
  imageUrl: string;
};

const emptyForm = (): FormState => ({
  title: '',
  category: RECIPE_CATEGORIES[0],
  ingredients: '',
  prepTimeMinutes: 30,
  difficulty: 'easy',
  steps: '',
  imageUrl: '',
});

export const RecipeFormPage = memo(function RecipeFormPage(): ReactElement {
  const { id } = useParams();
  const mode = id ? 'edit' : 'create';
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetchRecipe(id);
        if (cancelled) return;
        setForm({
          title: r.title,
          category: r.category,
          ingredients: r.ingredients.join('\n'),
          prepTimeMinutes: r.prepTimeMinutes,
          difficulty: r.difficulty,
          steps: r.steps.join('\n'),
          imageUrl: r.imageUrl ?? '',
        });
      } catch (e) {
        if (!cancelled) setError(toApiError(e).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, mode]);

  const titleText = useMemo(() => (mode === 'edit' ? 'Редактирование' : 'Новый рецепт'), [mode]);

  const onFile = useCallback((file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);
      const ingredients = form.ingredients
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const steps = form.steps
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!form.title.trim() || ingredients.length === 0 || steps.length === 0) {
        setError('Заполните название, ингредиенты и шаги.');
        setSaving(false);
        return;
      }
      try {
        const payload = {
          title: form.title.trim(),
          category: form.category,
          ingredients,
          prepTimeMinutes: form.prepTimeMinutes,
          difficulty: form.difficulty,
          steps,
          imageUrl: form.imageUrl || null,
        };
        if (mode === 'edit' && id) {
          const updated = await updateRecipe(id, payload);
          navigate(`/recipes/${updated.id}`, { replace: true });
        } else {
          const created = await createRecipe(payload);
          navigate(`/recipes/${created.id}`, { replace: true });
        }
      } catch (err) {
        setError(toApiError(err).message);
      } finally {
        setSaving(false);
      }
    },
    [form, id, mode, navigate]
  );

  if (loading) {
    return <p className={styles.form__state}>Загрузка рецепта…</p>;
  }

  return (
    <section className={styles.form}>
      <h1 className={styles.form__title}>{titleText}</h1>
      <form className={styles.form__grid} onSubmit={(e) => void onSubmit(e)}>
        <label className={styles.form__field}>
          Название
          <input
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </label>
        <label className={styles.form__field}>
          Категория
          <select
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.form__field}>
          Время (мин)
          <input
            type="number"
            min={5}
            step={5}
            value={form.prepTimeMinutes}
            onChange={(e) =>
              setForm((p) => ({ ...p, prepTimeMinutes: Number(e.target.value) || 0 }))
            }
          />
        </label>
        <label className={styles.form__field}>
          Сложность
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm((p) => ({ ...p, difficulty: e.target.value as RecipeDifficulty }))
            }
          >
            <option value="easy">Лёгкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
        </label>
        <label className={`${styles.form__field} ${styles['form__field--wide']}`}>
          Ингредиенты (каждый с новой строки)
          <textarea
            required
            rows={6}
            value={form.ingredients}
            onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))}
          />
        </label>
        <label className={`${styles.form__field} ${styles['form__field--wide']}`}>
          Шаги (каждый с новой строки)
          <textarea
            required
            rows={8}
            value={form.steps}
            onChange={(e) => setForm((p) => ({ ...p, steps: e.target.value }))}
          />
        </label>
        <div className={`${styles.form__field} ${styles['form__field--wide']}`}>
          <span>Изображение</span>
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          {form.imageUrl ? (
            <img className={styles.form__preview} src={form.imageUrl} alt="" />
          ) : null}
        </div>
        {error ? <p className={styles.form__error}>{error}</p> : null}
        <div className={styles.form__actions}>
          <button type="submit" disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </section>
  );
});
