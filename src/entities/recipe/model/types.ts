export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface RecipeAuthor {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients: string[];
  prepTimeMinutes: number;
  difficulty: RecipeDifficulty;
  steps: string[];
  imageUrl: string | null;
  author: RecipeAuthor;
  createdAt: string;
}

export interface RecipePayload {
  title: string;
  category: string;
  ingredients: string[];
  prepTimeMinutes: number;
  difficulty: RecipeDifficulty;
  steps: string[];
  imageUrl?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RecipeFilters {
  q?: string;
  category?: string;
  ingredient?: string;
  maxPrepTime?: number;
}
