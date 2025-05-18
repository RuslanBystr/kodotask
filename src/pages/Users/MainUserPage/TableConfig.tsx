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
    accessorKey: 'firstName',
    header: getDefaultColumnHeader({ name: 'Name' }),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <AvatarCell row={row} />
        <p>{row.original.firstName}</p>
        <p>{row.original.lastName}</p>
      </div>
    ),
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
    accessorKey: 'options',
    header: () => <div />,
    cell: ({ row }) => <OptionsCell row={row} />,
  },
];
