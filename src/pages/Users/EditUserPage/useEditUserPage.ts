import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useToastMessageRequest } from '@/hooks';
import { useEditUserMutation, useGetUserByIdQuery } from '@/services/users';
import type { IUserFormParams } from '@/types';

export const useEditUserPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: user } = useGetUserByIdQuery(id);

  const [editUser, { isLoading: isEditUserLoading, ...editUserRequestParams }] = useEditUserMutation();
  useToastMessageRequest(editUserRequestParams);

  const initialUserValues = useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      userName: user?.userName ?? '',
      email: user?.email ?? '',
      password: user?.password ?? '',
      isBlocked: user?.isBlocked ?? false,
      phone: user?.phone ?? '',
    }),
    [user],
  );

  const onUserSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ ...params }: IUserFormParams) => {
      editUser({
        id: Number(id),
        ...params,
      });
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  return {
    id,
    initialUserValues,
    isEditUserLoading,
    editUserRequestParams,
    onUserSubmit,
  };
};
