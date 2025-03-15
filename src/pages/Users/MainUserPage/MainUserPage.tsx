import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { CustomDataTable } from '@/components/table/CustomTable';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AdminRoleEnum } from '@/enums';
import { selectAuthenticatedUserSelector } from '@/store';

import { columns } from './TableConfig';
import { useMainUserPage } from './useMainUserPage';

const MainUserPage: React.FC = () => {
  const {
    users,
    goToCreateUserPage,
    isLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    paginateParams,
    meta,
  } = useMainUserPage();

  const admin = useSelector(selectAuthenticatedUserSelector);

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Users</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {admin?.role !== AdminRoleEnum.VIEWER && (
        <Button className="mt-5" variant="outline" onClick={goToCreateUserPage}>
          <PlusIcon />
          Create User
        </Button>
      )}
      <div className="flex justify-center">
        <CustomDataTable
          columns={columns}
          data={users?.items || []}
          isLoading={isLoading}
          meta={meta}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          paginateParams={paginateParams}
        />
      </div>
    </div>
  );
};

export default MainUserPage;
