import { memo, type ReactElement } from 'react';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export const LoginPage = memo(function LoginPage(): ReactElement {
  return <LoginForm />;
});
