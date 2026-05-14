import { apiClient } from '@/shared/api/client';
import type { AuthResponse, Recipe, RecipeFilters, RecipePayload, User } from '@/entities/recipe/model/types';

export async function register(payload: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

export async function fetchRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  const { data } = await apiClient.get<Recipe[]>('/recipes', { params: filters });
  return data;
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const { data } = await apiClient.get<Recipe>(`/recipes/${id}`);
  return data;
}

export async function fetchLatestRecipes(limit = 6): Promise<Recipe[]> {
  const { data } = await apiClient.get<Recipe[]>('/recipes/latest', { params: { limit } });
  return data;
}

export async function createRecipe(payload: RecipePayload): Promise<Recipe> {
  const { data } = await apiClient.post<Recipe>('/recipes', payload);
  return data;
}

export async function updateRecipe(id: string, payload: RecipePayload): Promise<Recipe> {
  const { data } = await apiClient.patch<Recipe>(`/recipes/${id}`, payload);
  return data;
}

export async function deleteRecipe(id: string): Promise<void> {
  await apiClient.delete(`/recipes/${id}`);
}

export async function fetchFavorites(): Promise<Recipe[]> {
  const { data } = await apiClient.get<Recipe[]>('/favorites');
  return data;
}

export async function addFavorite(recipeId: string): Promise<void> {
  await apiClient.post(`/favorites/${recipeId}`);
}

export async function removeFavorite(recipeId: string): Promise<void> {
  await apiClient.delete(`/favorites/${recipeId}`);
}
