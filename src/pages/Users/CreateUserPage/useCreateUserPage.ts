import { useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { userCreateFormSchema } from '@/components/forms/UserForm/schemas';
import { Pathes } from '@/constants';
import { useToastMessageRequest } from '@/hooks';
import { useCreateUserMutation } from '@/services/users';
import type { IUserFormParams } from '@/types';

export const useCreateUserPage = () => {
  const validationSchema = userCreateFormSchema;

  const [createUser, { isLoading, isSuccess, ...requestParams }] = useCreateUserMutation();

  useToastMessageRequest({ isSuccess, ...requestParams });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(Pathes.Users);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onSubmit: SubmitHandler<IUserFormParams> = useCallback(({ ...params }: IUserFormParams) => {
    createUser({
      ...params,
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    onSubmit,
    validationSchema,
  };
};
