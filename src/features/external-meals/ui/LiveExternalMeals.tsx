import { memo, type ReactElement } from 'react';
import { useLiveExternalMeals } from '@/features/external-meals/model/useLiveExternalMeals';
import styles from './LiveExternalMeals.module.css';

function formatTime(d: Date): string {
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export const LiveExternalMeals = memo(function LiveExternalMeals(): ReactElement {
  const { items, loading, error, lastUpdatedAt, refresh } = useLiveExternalMeals(6);

  return (
    <section className={styles.live} aria-labelledby="live-external-heading">
      <header className={styles.live__header}>
        <div className={styles.live__intro}>
          <p className={styles.live__eyebrow}>Интеграция API</p>
          <h2 id="live-external-heading" className={styles.live__title}>
            Живая лента TheMealDB
          </h2>
          <p className={styles.live__lead}>
            Публичный каталог блюд: лента подтягивается с сервера и обновляется по расписанию, а
            также при возврате на вкладку — без перезагрузки страницы.
          </p>
        </div>
        <div className={styles.live__meta}>
          {lastUpdatedAt ? (
            <span className={styles.live__stamp}>
              Обновлено: {formatTime(lastUpdatedAt)}
              {items.length > 0 ? (
                <span className={styles.live__pulse} title="Автообновление активно" aria-hidden />
              ) : null}
            </span>
          ) : null}
          <button type="button" className={styles.live__refresh} onClick={refresh} disabled={loading}>
            Обновить сейчас
          </button>
        </div>
      </header>

      {loading && !items.length ? <p className={styles.live__state}>Загрузка TheMealDB…</p> : null}
      {error ? <p className={styles.live__error}>{error}</p> : null}

      {items.length > 0 ? (
        <ul className={styles.live__grid}>
          {items.map((m) => (
            <li key={m.id} className={styles.live__card}>
              <a className={styles.live__link} href={m.href} target="_blank" rel="noreferrer noopener">
                <div className={styles.live__media}>
                  {m.thumbUrl ? (
                    <img className={styles.live__img} src={m.thumbUrl} alt="" loading="lazy" />
                  ) : (
                    <div className={styles.live__placeholder}>Нет фото</div>
                  )}
                </div>
                <div className={styles.live__body}>
                  <p className={styles.live__name}>{m.title}</p>
                  <div className={styles.live__tags} aria-label="Категория и регион">
                    <span className={styles.live__tag}>{m.category}</span>
                    <span className={styles.live__tag}>{m.area}</span>
                  </div>
                  <span className={styles.live__ext}>Открыть на TheMealDB ↗</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
});
