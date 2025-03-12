import { ColumnDef } from '@tanstack/react-table';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { AvatarCell } from '@/pages/Users/MainUserPage/сells/AvatarCell';
import { IsBlockedCell } from '@/pages/Users/MainUserPage/сells/IsBlockedCell';
import { OptionsCell } from '@/pages/Users/MainUserPage/сells/OptionsCell';
import { IUserResponse } from '@/types/responses/IUserResponse';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
    accessorKey: 'isBlocked',
    header: getDefaultColumnHeader({ name: 'Blocked', search: false }),
    cell: ({ row }) => <IsBlockedCell row={row} />,
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
