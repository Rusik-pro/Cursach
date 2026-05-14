import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { memo, useMemo, type ReactElement } from 'react';
import { useAuth } from '@/features/auth/model/AuthContext';
import styles from './AppShell.module.css';

function AppShellComponent(): ReactElement {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const pageKey = location.pathname;

  const authBlock = useMemo(() => {
    if (!token || !user) {
      return (
        <div className={styles.shell__auth}>
          <NavLink className={styles.shell__navLink} to="/login">
            Вход
          </NavLink>
          <NavLink className={styles.shell__navLink} to="/register">
            Регистрация
          </NavLink>
        </div>
      );
    }
    return (
      <div className={styles.shell__auth}>
        <span className={styles.shell__user}>{user.name}</span>
        <button type="button" className={styles.shell__logout} onClick={logout}>
          Выйти
        </button>
      </div>
    );
  }, [token, user, logout]);

  return (
    <div className={styles.shell}>
      <header className={styles.shell__header}>
        <Link className={styles.shell__brand} to="/">
          Рецепты
        </Link>
        <nav className={styles.shell__nav} aria-label="Основная навигация">
          <NavLink className={styles.shell__navLink} to="/" end>
            Дашборд
          </NavLink>
          <NavLink className={styles.shell__navLink} to="/recipes">
            Каталог
          </NavLink>
          {token ? (
            <>
              <NavLink className={styles.shell__navLink} to="/recipes/new">
                Новый рецепт
              </NavLink>
              <NavLink className={styles.shell__navLink} to="/favorites">
                Избранное
              </NavLink>
            </>
          ) : null}
        </nav>
        {authBlock}
      </header>
      <main className={styles.shell__main}>
        <div key={pageKey} className={styles.shell__page}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export const AppShell = memo(AppShellComponent);
