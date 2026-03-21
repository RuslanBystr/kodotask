import { PlusIcon } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { CustomDataTable } from '@/components/table/CustomTable';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AdminRoleEnum } from '@/enums';
import { useMainTaskPage } from '@/pages/task/main-task-page/useMainTaskPage';
import { selectAuthenticatedUserSelector } from '@/store';
import { getEnv } from '@/utils';

import { columns } from './TableConfig';

const { api } = getEnv();

const MainTaskPage: React.FC = () => {
  const { isMobile } = useSidebar();

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
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="" className="text-xl">
                Tasks
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="h-[calc(100vh-72px)] overflow-y-auto">
        <div className="flex justify-between">
          {admin?.role !== AdminRoleEnum.VIEWER && (
            <Button
              className="mt-5 rounded-none transition-all active:scale-95 bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
              onClick={goToCreateTaskPage}
            >
              <PlusIcon />
              Add Task
            </Button>
          )}
          <div className="mt-5 lg:hidden">
            <select
              className="w-full px-4 text-white h-full bg-[--main-button] focus:outline-none focus:ring-2 focus:ring-[--main-button] cut cut-right-5 cut-left-5"
              value={selectProject}
              onChange={(e) => setSelectProject(e.target.value as unknown as number)}
            >
              <option className="text-white" value="" disabled>
                Select a project
              </option>
              {projects?.items.map((project) => (
                <option className="text-white" key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row border-b">
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
          <div className="hidden lg:block border-l ml-2 w-[320px]">
            {projects?.items.map((project) => (
              <SidebarMenuButton
                key={project.id}
                className={`w-full rounded-none justify-start items-center  ${
                  selectProject === project.id
                    ? 'bg-accent hover:bg-transparent/10'
                    : 'bg-transparent hover:bg-transparent/10'
                }`}
                onClick={() => setSelectProject(project.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-7 w-7 rounded-lg">
                    <AvatarImage src={`${api}/file/${project?.image}`} alt="file" />
                  </Avatar>
                  <p>{project?.name}</p>
                </div>
              </SidebarMenuButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTaskPage;
