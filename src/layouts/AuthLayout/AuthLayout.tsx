import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: FC = () => (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 animated-bg">
    <div className="w-full max-w-sm">
      <Outlet />
    </div>
  </div>
);
