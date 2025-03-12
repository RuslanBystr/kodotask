import { ColumnDef } from '@tanstack/react-table';

import { getDefaultColumnHeader } from '@/components/table/CustomTable/TableHeader';
import { IChatResponse } from '@/types/responses/IChatResponse';

export const columns: ColumnDef<IChatResponse>[] = [
  {
    accessorKey: 'image',
    header: getDefaultColumnHeader({ name: '', sort: false, search: false }),
  },
  {
    accessorKey: 'name',
    header: getDefaultColumnHeader({ name: 'User' }),
  },
];
