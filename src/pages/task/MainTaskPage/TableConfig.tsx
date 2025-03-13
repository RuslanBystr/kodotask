import { ColumnDef } from '@tanstack/react-table';
import { CheckCheckIcon } from 'lucide-react';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { AvatarCell } from '@/pages/task/MainTaskPage/сells/AvatarCell';
import { IconCell } from '@/pages/task/MainTaskPage/сells/IconCell';
import { Task } from '@/types/responses/IProjectResponse';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'project.name',
    header: getDefaultColumnHeader({ name: 'Project' }),
    cell: ({ row }) => (
      <div className="flex">
        <IconCell row={row} />
        <p className="ml-1">{row.original.project.name}</p>
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: getDefaultColumnHeader({ name: 'Task' }),
  },
  {
    accessorKey: 'assignedTo',
    header: getDefaultColumnHeader({ name: 'Assignee' }),
    cell: ({row}) => (
      <div className="flex items-center">
        <AvatarCell row={row} />
        <span className="ml-2">{row.original.assignedUser.firstName} {row.original.assignedUser.lastName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'priority',
    header: getDefaultColumnHeader({ name: 'Priority', search: false }),
  },
  {
    accessorKey: 'status',
    header: getDefaultColumnHeader({ name: 'Status', sort: false, search: false }),
    cell: ({row}) => (
      <div className="flex items-center">
          {row.original.status === 'DONE'
            ? <CheckCheckIcon className="text-green-400" />
            : row.original.status
          }
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: getDefaultColumnHeader({ name: 'Created', search: false }),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  }
];
