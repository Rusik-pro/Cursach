import type { Recipe, RecipeDifficulty, User } from '@/entities/recipe/model/types';
import { demoRecipeImages } from '@/mocks/demoRecipeImages';

export function id(): string {
  return crypto.randomUUID();
}

const now = (): string => new Date().toISOString();

export const demoPassword = 'demo';

export let users: User[] = [
  { id: 'u1', email: 'chef@example.com', name: 'Анна Шеф' },
  { id: 'u2', email: 'cook@example.com', name: 'Иван Кулинар' },
];

export const userPasswords = new Map<string, string>([
  ['chef@example.com', demoPassword],
  ['cook@example.com', demoPassword],
]);

export let recipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Борщ классический',
    category: 'Обеды',
    ingredients: ['Свёкла', 'Капуста', 'Говядина', 'Картофель', 'Лук', 'Морковь'],
    prepTimeMinutes: 120,
    difficulty: 'medium',
    steps: [
      'Сварить насыщенный мясной бульон.',
      'Обжарить овощи, добавить свёклу и томат.',
      'Сложить всё в бульон, тушить до мягкости.',
      'Подать со сметаной и чесноком.',
    ],
    imageUrl: demoRecipeImages.borscht,
    author: { id: 'u1', name: 'Анна Шеф' },
    createdAt: now(),
  },
  {
    id: 'r2',
    title: 'Овсяная каша с ягодами',
    category: 'Завтраки',
    ingredients: ['Овсянка', 'Молоко', 'Мёд', 'Ягоды', 'Масло'],
    prepTimeMinutes: 15,
    difficulty: 'easy',
    steps: ['Сварить овсянку на молоке.', 'Добавить мёд.', 'Выложить ягоды сверху.'],
    imageUrl: demoRecipeImages.porridge,
    author: { id: 'u2', name: 'Иван Кулинар' },
    createdAt: now(),
  },
  {
    id: 'r3',
    title: 'Тирамису',
    category: 'Десерты',
    ingredients: ['Маскарпоне', 'Яйца', 'Савоярди', 'Кофе', 'Какао'],
    prepTimeMinutes: 40,
    difficulty: 'hard',
    steps: [
      'Приготовить крем из маскарпоне и желтков.',
      'Обмакнуть печенье в кофе, слоями уложить с кремом.',
      'Охладить не менее 4 часов, посыпать какао.',
    ],
    imageUrl: demoRecipeImages.tiramisu,
    author: { id: 'u1', name: 'Анна Шеф' },
    createdAt: now(),
  },
  {
    id: 'r4',
    title: 'Смузи зелёный',
    category: 'Напитки',
    ingredients: ['Шпинат', 'Банан', 'Яблоко', 'Вода', 'Лайм'],
    prepTimeMinutes: 10,
    difficulty: 'easy',
    steps: ['Нарезать фрукты.', 'Взбить блендером до однородности.', 'Сразу подать.'],
    imageUrl: demoRecipeImages.smoothie,
    author: { id: 'u2', name: 'Иван Кулинар' },
    createdAt: now(),
  },
];

export const favoritesByUser = new Map<string, Set<string>>([
  ['u1', new Set(['r2', 'r4'])],
  ['u2', new Set(['r1'])],
]);

export function resetDb(): void {
  users = [
    { id: 'u1', email: 'chef@example.com', name: 'Анна Шеф' },
    { id: 'u2', email: 'cook@example.com', name: 'Иван Кулинар' },
  ];
  userPasswords.clear();
  userPasswords.set('chef@example.com', demoPassword);
  userPasswords.set('cook@example.com', demoPassword);
  recipes = [
    {
      id: 'r1',
      title: 'Борщ классический',
      category: 'Обеды',
      ingredients: ['Свёкла', 'Капуста', 'Говядина', 'Картофель', 'Лук', 'Морковь'],
      prepTimeMinutes: 120,
      difficulty: 'medium' as RecipeDifficulty,
      steps: [
        'Сварить насыщенный мясной бульон.',
        'Обжарить овощи, добавить свёклу и томат.',
        'Сложить всё в бульон, тушить до мягкости.',
        'Подать со сметаной и чесноком.',
      ],
      imageUrl: demoRecipeImages.borscht,
      author: { id: 'u1', name: 'Анна Шеф' },
      createdAt: now(),
    },
    {
      id: 'r2',
      title: 'Овсяная каша с ягодами',
      category: 'Завтраки',
      ingredients: ['Овсянка', 'Молоко', 'Мёд', 'Ягоды', 'Масло'],
      prepTimeMinutes: 15,
      difficulty: 'easy',
      steps: ['Сварить овсянку на молоке.', 'Добавить мёд.', 'Выложить ягоды сверху.'],
      imageUrl: demoRecipeImages.porridge,
      author: { id: 'u2', name: 'Иван Кулинар' },
      createdAt: now(),
    },
    {
      id: 'r3',
      title: 'Тирамису',
      category: 'Десерты',
      ingredients: ['Маскарпоне', 'Яйца', 'Савоярди', 'Кофе', 'Какао'],
      prepTimeMinutes: 40,
      difficulty: 'hard',
      steps: [
        'Приготовить крем из маскарпоне и желтков.',
        'Обмакнуть печенье в кофе, слоями уложить с кремом.',
        'Охладить не менее 4 часов, посыпать какао.',
      ],
      imageUrl: demoRecipeImages.tiramisu,
      author: { id: 'u1', name: 'Анна Шеф' },
      createdAt: now(),
    },
    {
      id: 'r4',
      title: 'Смузи зелёный',
      category: 'Напитки',
      ingredients: ['Шпинат', 'Банан', 'Яблоко', 'Вода', 'Лайм'],
      prepTimeMinutes: 10,
      difficulty: 'easy',
      steps: ['Нарезать фрукты.', 'Взбить блендером до однородности.', 'Сразу подать.'],
      imageUrl: demoRecipeImages.smoothie,
      author: { id: 'u2', name: 'Иван Кулинар' },
      createdAt: now(),
    },
  ];
  favoritesByUser.clear();
  favoritesByUser.set('u1', new Set(['r2', 'r4']));
  favoritesByUser.set('u2', new Set(['r1']));
}

export function issueToken(userId: string): string {
  return `mock.${btoa(JSON.stringify({ sub: userId, iat: Date.now() }))}.sig`;
}

export function readUserIdFromRequest(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length);
  const part = token.split('.')[1];
  if (!part) return null;
  try {
    const payload = JSON.parse(atob(part)) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId);
}

export function ensureFavorites(userId: string): Set<string> {
  let set = favoritesByUser.get(userId);
  if (!set) {
    set = new Set();
    favoritesByUser.set(userId, set);
  }
  return set;
}
