import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ComponentUI, type ComponentUIProps } from '@/shared/ui/ComponentUI';
import type { Recipe } from '@/entities/recipe/model/types';
import styles from './RecipeCard.module.css';

export type RecipeCardProps = ComponentUIProps & {
  recipe: Recipe;
  index?: number;
};

export class RecipeCard extends ComponentUI<RecipeCardProps> {
  protected readonly bemBlock = 'recipeCard';

  public override render(): ReactNode {
    const { recipe, className, index = 0, 'data-testid': testId } = this.props;
    const rootClass = this.mergeClassNames(this.bem(styles), className);
    const delay = `${Math.min(index, 8) * 60}ms`;

    return (
      <article
        className={rootClass}
        style={{ animationDelay: delay }}
        data-testid={testId}
      >
        <Link className={this.bem(styles, 'link')} to={`/recipes/${recipe.id}`}>
          <div className={this.bem(styles, 'media')}>
            {recipe.imageUrl ? (
              <img
                className={this.bem(styles, 'image')}
                src={recipe.imageUrl}
                alt=""
                loading="lazy"
              />
            ) : (
              <div className={this.bem(styles, 'placeholder')}>Без фото</div>
            )}
          </div>
          <div className={this.bem(styles, 'body')}>
            <h3 className={this.bem(styles, 'title')}>{recipe.title}</h3>
            <p className={this.bem(styles, 'meta')}>
              {recipe.category} · {recipe.prepTimeMinutes} мин · {recipe.difficulty}
            </p>
            <p className={this.bem(styles, 'author')}>{recipe.author.name}</p>
          </div>
        </Link>
      </article>
    );
  }
}
