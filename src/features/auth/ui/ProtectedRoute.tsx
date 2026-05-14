import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/model/AuthContext';
import type { ReactElement } from 'react';

export function ProtectedRoute({ children }: { children: ReactElement }): ReactElement {
  const { status, token } = useAuth();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="app-shell__loading" data-testid="protected-loading">
        Загрузка…
      </div>
    );
  }

  if (!token || status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
