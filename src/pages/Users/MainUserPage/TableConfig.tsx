import { ColumnDef } from '@tanstack/react-table';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { AvatarCell, OptionsCell } from '@/pages/Users/MainUserPage/cells';
import { IUserResponse } from '@/types/responses/IUserResponse';

export const columns: ColumnDef<IUserResponse>[] = [
  {
    accessorKey: 'id',
    header: getDefaultColumnHeader({ name: 'id' }),
  },
  {
    accessorKey: 'avatar',
    header: getDefaultColumnHeader({ name: 'Avatar', sort: false, search: false }),
    cell: ({ row }) => <AvatarCell row={row} />,
  },
  {
    accessorKey: 'firstName',
    header: getDefaultColumnHeader({ name: 'First name' }),
  },
  {
    accessorKey: 'lastName',
    header: getDefaultColumnHeader({ name: 'Last name' }),
  },
  {
    accessorKey: 'email',
    header: getDefaultColumnHeader({ name: 'Email' }),
  },
  {
    accessorKey: 'createdAt',
    header: getDefaultColumnHeader({ name: 'Created', search: false }),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: 'updatedAt',
    header: getDefaultColumnHeader({ name: 'Updated', search: false }),
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    accessorKey: 'options',
    header: () => <div />,
    cell: ({ row }) => <OptionsCell row={row} />,
  },
];
