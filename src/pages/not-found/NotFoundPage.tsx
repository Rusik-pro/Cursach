import { memo, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = memo(function NotFoundPage(): ReactElement {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFound__title}>404</h1>
      <p className={styles.notFound__text}>Страница не найдена.</p>
      <Link className={styles.notFound__link} to="/">
        На главную
      </Link>
    </div>
  );
});
