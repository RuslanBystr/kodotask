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
  const { projects, goToCreateProjectPage, sorting, setSorting, columnFilters, setColumnFilters, paginateParams, meta } =
    useMainProjectPage();

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
          <Button className="mt-5 float-right" variant="outline" onClick={goToCreateProjectPage}>
            <PlusIcon />
            START A NEW PROJECT
          </Button>
        </div>
      )}
      <div className="flex justify-center">
        <CustomDataTable
          columns={columns}
          data={projects?.items || []}
          meta={meta}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          paginateParams={paginateParams}
          selectColumns={false}
        />
      </div>
    </div>
  );
};

export default MainProjectPage;
