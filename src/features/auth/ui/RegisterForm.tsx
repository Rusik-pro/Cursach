import { memo, useCallback, useMemo, useState, type FormEvent, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/shared/api/recipeApi';
import { useAuth } from '@/features/auth/model/AuthContext';
import { toApiError } from '@/shared/api/client';
import styles from './AuthForm.module.css';

function RegisterFormComponent(): ReactElement {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => name.trim() && email.trim() && password.length >= 4,
    [name, email, password]
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      setLoading(true);
      setError(null);
      try {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setSession(res.token, res.user);
        navigate('/', { replace: true });
      } catch (err) {
        setError(toApiError(err).message);
      } finally {
        setLoading(false);
      }
    },
    [canSubmit, email, name, password, navigate, setSession]
  );

  return (
    <div className={styles.auth}>
      <h1 className={styles.auth__title}>Регистрация</h1>
      <form className={styles.auth__form} onSubmit={onSubmit}>
        <label className={styles.auth__label}>
          Имя
          <input
            className={styles.auth__input}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label className={styles.auth__label}>
          Email
          <input
            className={styles.auth__input}
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className={styles.auth__label}>
          Пароль
          <input
            className={styles.auth__input}
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="new-password"
            required
            minLength={4}
          />
        </label>
        {error ? <p className={styles.auth__error}>{error}</p> : null}
        <button className={styles.auth__submit} type="submit" disabled={!canSubmit || loading}>
          {loading ? 'Создаём…' : 'Создать аккаунт'}
        </button>
      </form>
      <p className={styles.auth__hint}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export const RegisterForm = memo(RegisterFormComponent);
