import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Recipe } from '@/entities/recipe/model/types';
import { RecipeCard } from '@/widgets/recipe-card/ui/RecipeCard';

const recipe: Recipe = {
  id: 'test-1',
  title: 'Тестовый суп',
  category: 'Обеды',
  ingredients: ['Вода'],
  prepTimeMinutes: 20,
  difficulty: 'easy',
  steps: ['Вскипятить'],
  imageUrl: null,
  author: { id: 'u1', name: 'Тест' },
  createdAt: new Date().toISOString(),
};

describe('RecipeCard', () => {
  it('renders title and meta', () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>
    );
    expect(screen.getByText('Тестовый суп')).toBeInTheDocument();
    expect(screen.getByText(/Обеды/)).toBeInTheDocument();
  });
});
