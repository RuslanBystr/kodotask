import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationParams } from '@/hooks/usePagination';
import { IMetaResponse } from '@/types';
import { Loading } from '@/ui-kit/loading/Loading';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: IMetaResponse | undefined;
  isLoading: boolean;
  sorting: React.ComponentState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: React.ComponentState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  paginateParams: PaginationParams;
  selectColumns?: boolean;
  rowClickNavigateId?: boolean;
}

export function CustomDataTable<TData extends { id: number | string }, TValue>({
  columns,
  data,
  isLoading,
  meta,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  paginateParams,
  selectColumns = true,
  rowClickNavigateId = false,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();
  const { page, onPageChange, rowsPerPage } = paginateParams;

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
  });

  return (
    <div className="w-full my-2 max-h-[70vh]">
      {selectColumns && (
        <div className="flex items-center justify-end py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="w-full max-h-[70vh] overflow-auto custom-scrollbar">
        <table className="table-auto w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-[#3D5059]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left whitespace-nowrap px-4 py-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    if (rowClickNavigateId && row.original.id) {
                      navigate(row.original.id.toString());
                    }
                  }}
                  className="hover:bg-muted cursor-pointer border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loading size={32} />
                    </div>
                  ) : (
                    'No results.'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 flex flex-row">
          <Select
            value={`${meta?.itemsPerPage}`}
            onValueChange={(value) => {
              paginateParams.onRowsPerPageChange(Number(value));
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 ml-2 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-1 items-center text-sm text-muted-foreground select-none">
            {meta
              ? `${(meta.currentPage - 1) * meta.itemsPerPage + 1} -
               ${Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} of ${meta.totalItems}`
              : 'Loading...'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onPageChange(e, page - 1)}
            disabled={page === 0}
            className="select-none"
          >
            <ArrowLeft />
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onPageChange(e, page + 1)}
            disabled={meta && page + 1 >= meta?.totalPages}
            className="select-none"
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
