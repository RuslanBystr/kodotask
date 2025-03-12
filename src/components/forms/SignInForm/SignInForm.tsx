import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
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
import { cn } from '@/utils/utils';

import { signInSchema } from './schema';

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

  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
