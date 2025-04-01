import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/router/constants';
import { useGetProfileQuery } from '@/services/auth';
import { authSlice, useAppDispatch } from '@/store';
import {
  // checkIsAdmin,
  getAccessToken,
} from '@/utils';
import { removeAccessToken } from '@/utils/auth';

interface AuthGuardProps {
  children: React.ReactElement;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = getAccessToken();

  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  // const isAdmin = checkIsAdmin(token);

  const { data: admin, isError } = useGetProfileQuery(token || '', {
    skip: !token,
  });

  useEffect(() => {
    if (!token || isError) {
      if (pathname !== requestedLocation) {
        removeAccessToken();
        setRequestedLocation(pathname);
      }
    }
  }, [pathname, token, isError, requestedLocation]);

  useEffect(() => {
    if (admin) {
      dispatch(
        authSlice.actions.setAccessToken({
          token,
          admin,
        }),
      );
    }
  }, [admin, token, dispatch]);

  if (!token || isError) {
    return <Navigate to={ROUTES.AUTH.ROOT} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return children;
};
