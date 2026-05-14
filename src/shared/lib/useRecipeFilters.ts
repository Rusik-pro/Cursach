import { useMemo, useState } from 'react';
import type { RecipeFilters } from '@/entities/recipe/model/types';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';

export function useRecipeFilters(): {
  q: string;
  setQ: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  ingredient: string;
  setIngredient: (v: string) => void;
  maxPrepTime: number | '';
  setMaxPrepTime: (v: number | '') => void;
  filters: RecipeFilters;
} {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState<number | ''>('');

  const dq = useDebouncedValue(q, 350);
  const ding = useDebouncedValue(ingredient, 350);

  const filters = useMemo((): RecipeFilters => {
    const f: RecipeFilters = {};
    if (dq.trim()) f.q = dq.trim();
    if (category) f.category = category;
    if (ding.trim()) f.ingredient = ding.trim();
    if (maxPrepTime !== '') f.maxPrepTime = Number(maxPrepTime);
    return f;
  }, [dq, category, ding, maxPrepTime]);

  return {
    q,
    setQ,
    category,
    setCategory,
    ingredient,
    setIngredient,
    maxPrepTime,
    setMaxPrepTime,
    filters,
  };
}
