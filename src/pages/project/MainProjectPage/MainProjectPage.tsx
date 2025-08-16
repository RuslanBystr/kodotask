import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { CustomDataTable } from '@/components/table/CustomTable';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AdminRoleEnum } from '@/enums';
import { useMainProjectPage } from '@/pages/project/MainProjectPage/useMainProjectPage';
import { selectAuthenticatedUserSelector } from '@/store';

import { columns } from './TableConfig';

const MainProjectPage: React.FC = () => {
  const {
    projects,
    goToCreateProjectPage,
    isLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    paginateParams,
    meta,
  } = useMainProjectPage();

  const admin = useSelector(selectAuthenticatedUserSelector);

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Projects</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {admin?.role !== AdminRoleEnum.VIEWER && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="mt-5 rounded-none transition-all active:scale-95 bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
            onClick={goToCreateProjectPage}
          >
            <PlusIcon />
            LET&apos;S CREATE A PROJECT
          </Button>
        </div>
      )}
      <div className="flex justify-center">
        <CustomDataTable
          columns={columns}
          data={projects?.items || []}
          isLoading={isLoading}
          meta={meta}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          paginateParams={paginateParams}
          selectColumns={false}
          rowClickNavigateId
        />
      </div>
    </div>
  );
};

export default MainProjectPage;
