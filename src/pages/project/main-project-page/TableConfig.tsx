import { ColumnDef } from '@tanstack/react-table';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { IProjectResponse } from '@/types/responses/IProjectResponse';

import { IconCell } from './сells/IconCell';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<IProjectResponse>[] = [
  {
    accessorKey: 'image',
    header: getDefaultColumnHeader({ name: '', sort: false, search: false }),
    cell: ({ row }) => <IconCell row={row} />,
  },
  {
    accessorKey: 'name',
    header: getDefaultColumnHeader({ name: 'Project Name' }),
  },
  {
    accessorKey: 'tasks',
    header: getDefaultColumnHeader({ name: 'Tasks', sort: false, search: false }),
    cell: ({ row }) => row.original.tasks.length,
  },
  {
    accessorKey: 'createdAt',
    header: getDefaultColumnHeader({ name: 'Created', search: false }),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  // {
  //   accessorKey: 'options',
  //   header: () => <div />,
  //   cell: ({ row }) => <OptionsCell row={row} />,
  // },
];
