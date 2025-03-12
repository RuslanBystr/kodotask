import React from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/router/constants';
import {
  // checkIsAdmin,
  getAccessToken,
} from '@/utils';

interface GuestGuardProps {
  children: React.ReactElement;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const token = getAccessToken();
  // const isAdmin = checkIsAdmin(token);
  //
  // if (token && isAdmin) {
  //   return <Navigate to={ROUTES.HOME} />;
  // }

  if (token) {
    return <Navigate to={ROUTES.HOME} />;
  }
  return children;
};
