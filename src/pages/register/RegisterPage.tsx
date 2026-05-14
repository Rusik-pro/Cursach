import { memo, type ReactElement } from 'react';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';

export const RegisterPage = memo(function RegisterPage(): ReactElement {
  return <RegisterForm />;
});
