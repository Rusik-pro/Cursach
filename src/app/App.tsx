import { Suspense, lazy, memo, type ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { AuthProvider } from '@/features/auth/model/AuthContext';
import { ProtectedRoute } from '@/features/auth/ui/ProtectedRoute';

const HomePage = lazy(async () => {
  const m = await import('@/pages/home/HomePage');
  return { default: m.HomePage };
});
const RecipesPage = lazy(async () => {
  const m = await import('@/pages/recipes/RecipesPage');
  return { default: m.RecipesPage };
});
const RecipeDetailPage = lazy(async () => {
  const m = await import('@/pages/recipe-detail/RecipeDetailPage');
  return { default: m.RecipeDetailPage };
});
const RecipeFormPage = lazy(async () => {
  const m = await import('@/pages/recipe-form/RecipeFormPage');
  return { default: m.RecipeFormPage };
});
const FavoritesPage = lazy(async () => {
  const m = await import('@/pages/favorites/FavoritesPage');
  return { default: m.FavoritesPage };
});
const LoginPage = lazy(async () => {
  const m = await import('@/pages/login/LoginPage');
  return { default: m.LoginPage };
});
const RegisterPage = lazy(async () => {
  const m = await import('@/pages/register/RegisterPage');
  return { default: m.RegisterPage };
});
const NotFoundPage = lazy(async () => {
  const m = await import('@/pages/not-found/NotFoundPage');
  return { default: m.NotFoundPage };
});

const Fallback = memo(function Fallback() {
  return <div className="app-shell__loading">Загрузка модуля…</div>;
});

function getRouterBasename(): string | undefined {
  const base = process.env.BASE_URL ?? '/';
  const trimmed = base.replace(/\/$/, '');
  return trimmed === '' ? undefined : trimmed;
}

const basename = getRouterBasename();

export function App(): ReactElement {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="recipes" element={<RecipesPage />} />
              <Route
                path="recipes/new"
                element={
                  <ProtectedRoute>
                    <RecipeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="recipes/:id/edit"
                element={
                  <ProtectedRoute>
                    <RecipeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route path="recipes/:id" element={<RecipeDetailPage />} />
              <Route
                path="favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
