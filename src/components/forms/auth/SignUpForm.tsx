import { FC, MouseEventHandler, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import GoogleIcon from '@/assets/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/router/constants';
import { useSignUpMutation } from '@/services/auth';
import { useAppDispatch } from '@/store';
import { authSlice } from '@/store/auth';
import { getEnv } from '@/utils';
import { cn } from '@/utils/utils';

const { api } = getEnv();

type Props = { onFlip: () => void };

type FormValues = {
  firstName: string;
  lastName: string;
  register_email: string;
  register_password: string;
  confirmPassword: string;
  terms?: boolean;
};

export const SignUpForm: FC<Props> = ({ onFlip }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [signUp, { data: registerData, isLoading, error }] = useSignUpMutation();

  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      register_email: '',
      register_password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = methods;

  const onSubmit = useCallback(
    async (values: FormValues) => {
      if (values.register_password !== values.confirmPassword) {
        setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }

      const credentials = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.register_email,
        password: values.register_password,
      };

      await signUp(credentials).unwrap();
    },
    [setError, signUp],
  );

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
          <CardTitle className="text-2xl text-[--main-text]">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="firstName"
                      className="rounded-none"
                      type="text"
                      placeholder="First Name"
                      {...register('firstName', { required: 'Required' })}
                    />
                    <p className="text-red-500 text-xs h-4">{errors.firstName?.message}</p>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="lastName"
                      className="rounded-none"
                      type="text"
                      placeholder="Last Name"
                      {...register('lastName', { required: 'Required' })}
                    />
                    <p className="text-red-500 text-xs h-4">{errors.lastName?.message}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Input
                    id="register_email"
                    className="rounded-none"
                    type="email"
                    placeholder="mail@example.com"
                    {...register('register_email', { required: 'Required' })}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.register_email?.message}</p>
                </div>

                <div className="grid gap-2">
                  <Input
                    id="register_password"
                    className="rounded-none"
                    type="password"
                    placeholder="Password"
                    {...register('register_password', {
                      required: 'Required',
                      minLength: { value: 6, message: 'Min 6 characters' },
                    })}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.register_password?.message}</p>
                </div>

                <div className="grid gap-2">
                  <Input
                    id="confirmPassword"
                    className="rounded-none"
                    type="password"
                    placeholder="Confirm Password"
                    {...register('confirmPassword', { required: 'Required' })}
                  />
                  <p className="text-red-500 text-xs h-4">{errors.confirmPassword?.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox className="h-5 w-5" {...register('terms')} />
                  <p className="text-[--main-text]">I agree to the terms</p>
                </div>
                {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

                <Button type="submit" className="w-full rounded-none" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>

                {error && <p className="text-red-500 text-xs">Registration failed</p>}

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
