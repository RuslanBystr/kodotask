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
  const {
    tasks,
    projects,
    goToCreateTaskPage,
    sorting,
    isLoading,
    setSorting,
    columnFilters,
    setColumnFilters,
    paginateParams,
    meta,
    selectProject,
    setSelectProject,
  } = useMainTaskPage();

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
      <div className="h-[calc(100vh-72px)] overflow-y-auto">
        {admin?.role !== AdminRoleEnum.VIEWER && (
          <Button
            className="mt-5 rounded-none transition-all active:scale-95 bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
            onClick={goToCreateTaskPage}
          >
            <PlusIcon />
            Add Task
          </Button>
        )}
        <div className="flex border-b">
          <CustomDataTable
            columns={columns}
            data={tasks?.items || []}
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
          <div className="hidden md:block border-l ml-2 w-[20vw]">
            {projects?.items.map((project) => (
              <Button
                key={project.id}
                className={`w-full rounded-none ${
                  selectProject === project.id
                    ? 'bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5'
                    : 'bg-transparent/10 hover:bg-transparent/20`'
                }`}
                onClick={() => setSelectProject(project.id)}
              >
                {project?.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTaskPage;
