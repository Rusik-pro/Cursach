import { mapThemealDbMealToPreview } from '@/shared/api/themealdbService';

describe('mapThemealDbMealToPreview', () => {
  it('maps meal and uses meal.php when no strSource', () => {
    const dto = {
      idMeal: '52772',
      strMeal: 'Teriyaki',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strMealThumb: 'https://example.com/t.jpg',
      strSource: null,
    };
    const r = mapThemealDbMealToPreview(dto);
    expect(r.id).toBe('52772');
    expect(r.title).toBe('Teriyaki');
    expect(r.href).toBe('https://www.themealdb.com/meal.php?c=52772');
  });

  it('prefers strSource when it is http URL', () => {
    const dto = {
      idMeal: '1',
      strMeal: 'X',
      strCategory: null,
      strArea: null,
      strMealThumb: null,
      strSource: 'https://cook.example.com/recipe',
    };
    expect(mapThemealDbMealToPreview(dto).href).toBe('https://cook.example.com/recipe');
  });
});
