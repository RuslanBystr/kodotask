import { zodResolver } from '@hookform/resolvers/zod';
import { FC, MouseEventHandler, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import GoogleIcon from '@/assets/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

type Props = {
  onFlip: () => void;
};

export const SignInForm: FC<Props> = ({ onFlip }) => {
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
    <div className="relative flex flex-col gap-6">
      <Card
        className={cn(
          'relative z-10 bg-transparent/40 border-none rounded-xl backdrop-blur-md overflow-hidden p-6',
          'cut cut-left-10 cut-right-10',
        )}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-[--main-text]">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[--main-text]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="rounded-none"
                    type="email"
                    placeholder="m@example.com"
                    {...register('email')}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.email ? errors.email.message : ''}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-[--main-text]">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    className="rounded-none"
                    type="password"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.password ? errors.password.message : ''}</p>
                </div>
                <div className="flex items-center gap-2" data-testid="remember-me" data-cy="remember-me">
                  <Checkbox className="h-5 w-5" />
                  <p className="text-[--main-text]">Remember me</p>
                </div>
                <Button type="submit" className="w-full rounded-none" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-none text-[--main-text] bg-[--main-button-dark]"
                  onClick={handleGoogleAuth}
                >
                  <GoogleIcon />
                  Login with Google
                </Button>
                <button type="button" onClick={onFlip} className="text-xs text-blue-400 hover:underline mt-2">
                  Don’t have an account? Register
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
