import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { UserForm } from '@/components';
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
import { useCreateUserPage } from '@/pages/Users/CreateUserPage/useCreateUserPage';

export default function CreateUserPage() {
  const props = useCreateUserPage();

  const navigate = useNavigate();

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href=".">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Create</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="h-[10vh] p-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Cancel
        </Button>
      </div>
      <div className="flex flex-col content-center items-center w-full">
        <h1 className="text-[20px]">Create user</h1>
        <UserForm {...props} />
      </div>
    </div>
  );
}
