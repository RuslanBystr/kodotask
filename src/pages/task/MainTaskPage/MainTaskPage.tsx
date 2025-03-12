import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { CustomDataTable } from '@/components/table/CustomTable';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AdminRoleEnum } from '@/enums';
import { useMainTaskPage } from '@/pages/task/MainTaskPage/useMainTaskPage';
import { selectAuthenticatedUserSelector } from '@/store';

import { columns } from './TableConfig';

const MainTaskPage: React.FC = () => {
  const { tasks, goToCreateTaskPage, sorting, setSorting, columnFilters, setColumnFilters, paginateParams, meta } =
    useMainTaskPage();

  const admin = useSelector(selectAuthenticatedUserSelector);

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Tasks</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {admin?.role !== AdminRoleEnum.VIEWER && (
        <Button className="mt-5" variant="outline" onClick={goToCreateTaskPage}>
          <PlusIcon />
          Add Task
        </Button>
      )}
      <div className="flex justify-center">
        <CustomDataTable
          columns={columns}
          data={tasks?.items || []}
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

export default MainTaskPage;
