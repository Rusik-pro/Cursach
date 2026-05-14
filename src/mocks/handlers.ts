import { http, HttpResponse } from 'msw';
import type { Recipe, RecipePayload, User } from '@/entities/recipe/model/types';
import {
  ensureFavorites,
  favoritesByUser,
  getUserById,
  issueToken,
  readUserIdFromRequest,
  recipes,
  userPasswords,
  users,
  id,
} from '@/mocks/db';

function unauthorized() {
  return HttpResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
}

function filterRecipes(params: URLSearchParams): Recipe[] {
  const q = (params.get('q') ?? '').toLowerCase();
  const category = params.get('category') ?? '';
  const ingredient = (params.get('ingredient') ?? '').toLowerCase();
  const maxPrep = params.get('maxPrepTime');

  return recipes.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q)) return false;
    if (category && r.category !== category) return false;
    if (ingredient && !r.ingredients.some((i) => i.toLowerCase().includes(ingredient))) {
      return false;
    }
    if (maxPrep) {
      const n = Number(maxPrep);
      if (!Number.isNaN(n) && r.prepTimeMinutes > n) return false;
    }
    return true;
  });
}

export const handlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };
    if (!body.email || !body.password || !body.name) {
      return HttpResponse.json({ message: 'Некорректные данные' }, { status: 400 });
    }
    if (users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email уже занят' }, { status: 400 });
    }
    const user: User = { id: id(), email: body.email, name: body.name };
    users.push(user);
    userPasswords.set(body.email, body.password);
    const token = issueToken(user.id);
    return HttpResponse.json({ token, user });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Некорректные данные' }, { status: 400 });
    }
    const user = users.find((u) => u.email === body.email);
    const pwd = userPasswords.get(body.email);
    if (!user || pwd !== body.password) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 });
    }
    return HttpResponse.json({ token: issueToken(user.id), user });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    const user = userId ? getUserById(userId) : undefined;
    if (!user) return unauthorized();
    return HttpResponse.json(user);
  }),

  http.get('/api/recipes', ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(filterRecipes(url.searchParams));
  }),

  http.get('/api/recipes/latest', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? '6');
    const sorted = [...recipes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return HttpResponse.json(sorted.slice(0, Math.max(1, Math.min(limit, 24))));
  }),

  http.get('/api/recipes/:id', ({ params }) => {
    const recipe = recipes.find((r) => r.id === params.id);
    if (!recipe) {
      return HttpResponse.json({ message: 'Рецепт не найден' }, { status: 404 });
    }
    return HttpResponse.json(recipe);
  }),

  http.post('/api/recipes', async ({ request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    const user = userId ? getUserById(userId) : undefined;
    if (!user) return unauthorized();
    const body = (await request.json()) as RecipePayload;
    if (!body.title || !body.category || !Array.isArray(body.ingredients) || !body.steps) {
      return HttpResponse.json({ message: 'Некорректные данные рецепта' }, { status: 400 });
    }
    const recipe: Recipe = {
      id: id(),
      title: body.title,
      category: body.category,
      ingredients: body.ingredients,
      prepTimeMinutes: body.prepTimeMinutes,
      difficulty: body.difficulty,
      steps: body.steps,
      imageUrl: body.imageUrl ?? null,
      author: { id: user.id, name: user.name },
      createdAt: new Date().toISOString(),
    };
    recipes.unshift(recipe);
    return HttpResponse.json(recipe, { status: 201 });
  }),

  http.patch('/api/recipes/:id', async ({ params, request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    if (!userId) return unauthorized();
    const idx = recipes.findIndex((r) => r.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Рецепт не найден' }, { status: 404 });
    }
    const existing = recipes[idx];
    if (existing.author.id !== userId) {
      return HttpResponse.json({ message: 'Нет прав на редактирование' }, { status: 403 });
    }
    const body = (await request.json()) as Partial<RecipePayload>;
    const updated: Recipe = {
      ...existing,
      title: body.title ?? existing.title,
      category: body.category ?? existing.category,
      ingredients: body.ingredients ?? existing.ingredients,
      prepTimeMinutes: body.prepTimeMinutes ?? existing.prepTimeMinutes,
      difficulty: body.difficulty ?? existing.difficulty,
      steps: body.steps ?? existing.steps,
      imageUrl: body.imageUrl === undefined ? existing.imageUrl : body.imageUrl,
    };
    recipes[idx] = updated;
    return HttpResponse.json(updated);
  }),

  http.delete('/api/recipes/:id', ({ params, request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    if (!userId) return unauthorized();
    const idx = recipes.findIndex((r) => r.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: 'Рецепт не найден' }, { status: 404 });
    }
    if (recipes[idx].author.id !== userId) {
      return HttpResponse.json({ message: 'Нет прав на удаление' }, { status: 403 });
    }
    recipes.splice(idx, 1);
    for (const set of favoritesByUser.values()) {
      set.delete(String(params.id));
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/favorites', ({ request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    if (!userId) return unauthorized();
    const fav = ensureFavorites(userId);
    const list = recipes.filter((r) => fav.has(r.id));
    return HttpResponse.json(list);
  }),

  http.post('/api/favorites/:recipeId', ({ params, request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    if (!userId) return unauthorized();
    const exists = recipes.some((r) => r.id === params.recipeId);
    if (!exists) {
      return HttpResponse.json({ message: 'Рецепт не найден' }, { status: 404 });
    }
    ensureFavorites(userId).add(String(params.recipeId));
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('/api/favorites/:recipeId', ({ params, request }) => {
    const userId = readUserIdFromRequest(request.headers.get('Authorization'));
    if (!userId) return unauthorized();
    ensureFavorites(userId).delete(String(params.recipeId));
    return new HttpResponse(null, { status: 204 });
  }),
];
