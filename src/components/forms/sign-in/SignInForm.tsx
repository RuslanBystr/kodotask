import { zodResolver } from '@hookform/resolvers/zod';
import { MouseEventHandler, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/router/constants';
import { useSignInMutation } from '@/services/auth';
import { useAppDispatch } from '@/store';
import { authSlice } from '@/store/auth';
import { TSignInFormData } from '@/types';
import { ISignInRequest } from '@/types/requests/ISignInRequest';
import { getEnv } from '@/utils';
import { cn } from '@/utils/utils';

import { signInSchema } from './schema';

const { api } = getEnv();

export const SignInForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [signIn, { data: loginData, isLoading }] = useSignInMutation();

  const methods = useForm<TSignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(signInSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = useCallback(
    (credentials: ISignInRequest) => {
      signIn(credentials);
    },
    [signIn],
  );

  useEffect(() => {
    if (!loginData) return;

    dispatch(
      authSlice.actions.setAccessToken({
        token: loginData?.token,
        admin: loginData?.admin,
      }),
    );
    navigate(ROUTES.HOME);
  }, [loginData, navigate, dispatch]);

  const handleGoogleAuth: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    window.location.href = `${api}/auth/google/login`;
  };

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card className="bg-transparent/30 shadow-md p-2">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
