import { memo, useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { addFavorite, removeFavorite } from '@/shared/api/recipeApi';
import { toApiError } from '@/shared/api/client';
import styles from './FavoriteToggle.module.css';

type Props = {
  recipeId: string;
  initialActive?: boolean;
};

function FavoriteToggleComponent({ recipeId, initialActive = false }: Props): ReactElement {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const label = useMemo(() => (active ? 'Убрать из избранного' : 'В избранное'), [active]);

  const onClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (active) {
        await removeFavorite(recipeId);
        setActive(false);
      } else {
        await addFavorite(recipeId);
        setActive(true);
      }
    } catch (e) {
      setError(toApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [active, recipeId]);

  return (
    <div className={styles.favorite}>
      <button
        type="button"
        className={styles.favorite__button}
        aria-pressed={active}
        onClick={() => void onClick()}
        disabled={loading}
        data-testid="favorite-toggle"
      >
        {active ? '★' : '☆'} {label}
      </button>
      {error ? <span className={styles.favorite__error}>{error}</span> : null}
    </div>
  );
}

export const FavoriteToggle = memo(FavoriteToggleComponent);
