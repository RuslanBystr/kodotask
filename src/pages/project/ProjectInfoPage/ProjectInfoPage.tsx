import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useGetMembersQuery } from '@/services/project';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export default function ProjectInfoPage() {
  const { id } = useParams<string>();
  const { data, isSuccess } = useGetMembersQuery({ id });

  return (
    <div className="w-full h-full p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/projects">Project</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex w-full h-full items-center">
        <div className="h-full w-[40%] border-x px-2">
          <h3 className="text-[28px]">Members</h3>
          <Button className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-right-5 cut-left-5">
            <PlusIcon className="w-6 h-6" />
            Add member
          </Button>
          {isSuccess &&
            data?.items.map((member: IUserResponse) => (
              <div
                key={String(member.id)}
                className="flex w-full my-1 p-2 items-center gap-2 hover:bg-transparent/10 cut cut-left-5 cut-right-5"
              >
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={`${api}/file/${member?.avatar}`} alt="file" />
                </Avatar>
                <div>
                  <span className="text-[--accent-text]">
                    {member.firstName} {member.lastName}
                  </span>
                  <div>fullstack developer</div>
                </div>
                <div className="flex flex-1 justify-end gap-2">
                  <EditIcon />
                  <TrashIcon />
                </div>
              </div>
            ))}
        </div>
        <div className="h-full w-full border-r px-2">
          <h3 className="text-[32px]">Project</h3>
        </div>
      </div>
    </div>
  );
}
