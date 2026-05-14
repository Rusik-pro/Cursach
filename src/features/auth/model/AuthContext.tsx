import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { User } from '@/entities/recipe/model/types';
import { fetchCurrentUser } from '@/shared/api/recipeApi';
import { getStoredToken, setStoredToken, toApiError } from '@/shared/api/client';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  token: string | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setStatus('anonymous');
    setError(null);
  }, []);

  const setSession = useCallback((newToken: string, newUser: User) => {
    setStoredToken(newToken);
    setToken(newToken);
    setUser(newUser);
    setStatus('authenticated');
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setStatus('anonymous');
      setUser(null);
      return;
    }
    setStatus('loading');
    try {
      const me = await fetchCurrentUser();
      setUser(me);
      setStatus('authenticated');
      setError(null);
    } catch (e) {
      setError(toApiError(e).message);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handler = (): void => {
      logout();
    };
    window.addEventListener('recipe-spa:unauthorized', handler);
    return () => window.removeEventListener('recipe-spa:unauthorized', handler);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      status,
      token,
      setSession,
      logout,
      refreshUser,
      error,
    }),
    [user, status, token, setSession, logout, refreshUser, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
