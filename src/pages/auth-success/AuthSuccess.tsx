import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToastMessageRequest } from '@/hooks';
import { ROUTES } from '@/router';
import { useGetProfileQuery } from '@/services/auth';
import { authSlice, useAppDispatch } from '@/store';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const {
    data: admin,
    isLoading,
    ...otherMethods
  } = useGetProfileQuery(token || '', {
    skip: !token,
  });

  useToastMessageRequest(otherMethods);

  useEffect(() => {
    if (token && token.trim()) {
      if (admin) {
        dispatch(authSlice.actions.setAccessToken({ token, admin }));

        setTimeout(() => {
          navigate(ROUTES.PROJECTS);
        }, 2000);
      }
    } else {
      setTimeout(() => {
        navigate(ROUTES.AUTH.ROOT);
      }, 2000);
    }
  }, [admin, dispatch, navigate, token]);

  return <h2>Authorized successfully. Redirecting in 2 seconds...</h2>;
};

export default AuthSuccess;
