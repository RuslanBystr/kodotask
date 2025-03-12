import { Row } from '@tanstack/react-table';
import { useSelector } from 'react-redux';

import { Checkbox } from '@/components/ui/checkbox';
import { AdminRoleEnum } from '@/enums/admins/adminRole';
import { useEditUserPage } from '@/pages/Users/EditUserPage/useEditUserPage';
import { selectAuthenticatedUserSelector } from '@/store';
import { IUserResponse } from '@/types/responses/IUserResponse';

export const IsBlockedCell = ({
  row,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}) => {
  const { onUserSubmit } = useEditUserPage();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleSubmit = (row: Row<IUserResponse>, checked: boolean) => {
    onUserSubmit({ ...row.original, isBlocked: checked });
  };
  const user = row.original;
  const admin = useSelector(selectAuthenticatedUserSelector);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={user.isBlocked}
        onCheckedChange={(checked) => handleSubmit(row, checked === true)}
        disabled={admin?.role === AdminRoleEnum.VIEWER}
      />
      <span>{user.isBlocked ? 'Blocked' : 'Active'}</span>
    </div>
  );
};
