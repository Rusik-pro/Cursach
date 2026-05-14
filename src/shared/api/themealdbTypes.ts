/** Ответ TheMealDB для /random.php */
export interface ThemealDbRandomResponse {
  meals: ThemealDbMealDto[] | null;
}

/** Поля блюда из TheMealDB (используем подмножество). */
export interface ThemealDbMealDto {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strMealThumb: string | null;
  strSource: string | null;
}

/** Сжатая модель для UI (не путать с доменным Recipe приложения). */
export interface ExternalMealPreview {
  id: string;
  title: string;
  category: string;
  area: string;
  thumbUrl: string | null;
  /** Ссылка на страницу блюда на TheMealDB или внешний источник. */
  href: string;
}
