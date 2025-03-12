import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IProjectFormParams } from '@/components/forms/ProjectForm/ProjectForm';
import { useToastMessageRequest } from '@/hooks';
import { useEditProjectMutation, useGetProjectByIdQuery } from '@/services/project';

export const useEditProjectPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: project } = useGetProjectByIdQuery(id);

  const [editProject, { isLoading: isEditProjectLoading, ...editProjectRequestParams }] = useEditProjectMutation();
  useToastMessageRequest(editProjectRequestParams);

  const initialProjectValues = useMemo(
    () => ({
      name: project?.name ?? '',
      description: project?.description ?? '',
    }),
    [project],
  );

  const onProjectSubmit  = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ ...params }: IProjectFormParams) => {
      editProject({
        id,
        ...params,
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  return {
    id,
    initialProjectValues,
    isEditProjectLoading,
    editProjectRequestParams,
    onProjectSubmit,
  };
};
