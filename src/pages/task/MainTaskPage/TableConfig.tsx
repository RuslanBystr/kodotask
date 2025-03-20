import { ColumnDef } from '@tanstack/react-table';
import { CheckCheckIcon, ChevronDown, ChevronRight, ChevronUp, CircleIcon, LoaderCircle } from 'lucide-react';

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
    cell: ({ row }) => (
      <div className="min-w-[300px]">
        <span className="ml-2">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: getDefaultColumnHeader({ name: 'Assignee' }),
    cell: ({ row }) => {
      const { assignedUser } = row.original;
      return (
        <div className="flex items-center">
          <AvatarCell row={row} />
          <span className="ml-2">
            {assignedUser.firstName} {assignedUser.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: getDefaultColumnHeader({ name: 'Priority', search: false }),
    cell: ({ row }) => {
      const priorities = {
        Low: { icon: ChevronDown, color: 'text-green-200' },
        High: { icon: ChevronUp, color: 'text-orange-400' },
        Medium: { icon: ChevronRight, color: 'text-blue-300' },
      };

      const { icon: Icon, color } = priorities[row.original.priority] || priorities.Medium;

      return (
        <div className="flex justify-center">
          <Icon className={color} />
          <p className={color}>{row.original.priority}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: getDefaultColumnHeader({ name: 'Status', sort: false, search: false }),
    cell: ({ row }) => {
      const statuses = {
        DONE: { icon: CheckCheckIcon, color: 'text-green-400' },
        TODO: { icon: CircleIcon, color: 'text-gray-600' },
        IN_PROGRESS: { icon: LoaderCircle, color: 'text-blue-400' },
      };

      const { icon: Icon, color } = statuses[row.original.status] || statuses.IN_PROGRESS;

      return (
        <div className="flex items-center">
          <Icon className={color} />
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: getDefaultColumnHeader({ name: 'Created', search: false }),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];
