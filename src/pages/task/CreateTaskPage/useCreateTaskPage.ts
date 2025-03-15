import { useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { taskCreateFormSchema } from '@/components/forms/TaskForm/schemas';
import { ITaskFormParams } from '@/components/forms/TaskForm/TaskForm';
import { Pathes } from '@/constants';
import { useToastMessageRequest } from '@/hooks';
import { useCreateTaskMutation } from '@/services/task';
import type { IFormProps } from '@/types';

export const useCreateTaskPage = (): IFormProps<ITaskFormParams> => {
  const validationSchema = taskCreateFormSchema;

  const [createTask, { isLoading, isSuccess, ...requestParams }] = useCreateTaskMutation();

  useToastMessageRequest({ isSuccess, ...requestParams });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(Pathes.Tasks);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onSubmit: SubmitHandler<ITaskFormParams> = useCallback(({ ...params }: ITaskFormParams) => {
    createTask({
      ...params,
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    onSubmit,
    validationSchema,
  };
};
