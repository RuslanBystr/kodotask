import { useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { IProjectFormParams } from '@/components/forms/ProjectForm/ProjectForm';
import { projectCreateFormSchema } from '@/components/forms/ProjectForm/schemas';
import { Pathes } from '@/constants';
import { useToastMessageRequest } from '@/hooks';
import { useCreateProjectMutation } from '@/services/project';

export const useCreateProjectPage = () => {
  const validationSchema = projectCreateFormSchema;

  const [createProject, { isLoading, isSuccess, ...requestParams }] = useCreateProjectMutation();

  useToastMessageRequest({ isSuccess, ...requestParams });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(Pathes.Projects);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const onSubmit: SubmitHandler<IProjectFormParams> = useCallback(({ ...params }: IProjectFormParams) => {
    createProject({
      ...params,
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    onSubmit,
    validationSchema,
  };
};
