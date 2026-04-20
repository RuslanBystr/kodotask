import { ColumnDef } from '@tanstack/react-table';
import { CheckCheckIcon, ChevronDown, ChevronRight, ChevronUp, CircleIcon } from 'lucide-react';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { AvatarCell } from '@/pages/task/main-task-page/cells/AvatarCell';
import { Task } from '@/types/responses/IProjectResponse';
import { Loading } from '@/ui-kit/loading/Loading';

export const columns: ColumnDef<Task>[] = [
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
        <div className="flex">
          <Icon className={color} />
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: getDefaultColumnHeader({ name: 'Status', sort: false, search: false }),
    cell: ({ row }) => {
      const statuses = {
        DONE: { icon: CheckCheckIcon, color: 'text-green-400', props: {} },
        TODO: { icon: CircleIcon, color: 'text-gray-600', props: {} },
        IN_PROGRESS: { icon: Loading, color: 'text-blue-400', props: { size: 26 } },
      };

      const { icon: Icon, color, props } = statuses[row.original.status] || statuses.IN_PROGRESS;

      return (
        <div className="flex items-center">
          <Icon className={color} {...props} />
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
