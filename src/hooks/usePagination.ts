import React, { ComponentState, useCallback, useEffect, useState } from 'react';

export interface PaginationParams {
  page: ComponentState;
  rowsPerPage: ComponentState;
  onPageChange: (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const usePagination = (filters: Record<string, string>): PaginationParams => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onPageChange = useCallback((_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage);
  }, []);

  const onRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows);
    setPage(0);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [filters, onRowsPerPageChange]);

  return { page, rowsPerPage, onPageChange, onRowsPerPageChange };
};

export default usePagination;
