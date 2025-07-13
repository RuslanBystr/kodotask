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
import { getEnv } from '@/utils';
import { cn } from '@/utils/utils';

const { api } = getEnv();

type Props = {
  onFlip: () => void;
};

export const SignUpForm: FC<Props> = ({ onFlip }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [_, { data: registerData, isLoading }] = useSignInMutation();

  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = useCallback(() => {}, []);

  useEffect(() => {
    if (!registerData) return;

    dispatch(
      authSlice.actions.setAccessToken({
        token: registerData.token,
        admin: registerData.admin,
      }),
    );
    navigate(ROUTES.HOME);
  }, [registerData, navigate, dispatch]);

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
          <CardTitle className="text-2xl text-[--main-text]">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-4">
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
                  <p className="text-red-500 text-xs h-4">{errors.email?.message}</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[--main-text]">
                    Password
                  </Label>
                  <Input id="password" className="rounded-none" type="password" {...register('password')} />
                  <p className="text-red-500 text-xs h-4">{errors.password?.message}</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-[--main-text]">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    className="rounded-none"
                    type="password"
                    {...register('confirmPassword')}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.confirmPassword?.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox className="h-5 w-5" />
                  <p className="text-[--main-text]">I agree to the terms</p>
                </div>

                <Button type="submit" className="w-full rounded-none" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full rounded-none text-[--main-text] bg-[--main-button-dark]"
                  onClick={handleGoogleAuth}
                >
                  <GoogleIcon />
                  Register with Google
                </Button>

                <button type="button" onClick={onFlip} className="text-xs text-blue-400 hover:underline mt-2">
                  Already have an account? Login
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
