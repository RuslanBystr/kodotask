import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAddMemberMutation, useGetMembersQuery, useRemoveMemberMutation } from '@/services/project';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export default function ProjectInfoPage() {
  const { id } = useParams<string>();

  const { data, isSuccess, isFetching } = useGetMembersQuery({ id: id! });
  const [addMember, { isLoading: adding }] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('member');

  const onAddMember = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }
    try {
      await addMember({ id: id!, body: { email } }).unwrap();
      toast.success('Member added');
      setOpen(false);
      setEmail('');
      setRole('member');
    } catch (err) {
      toast.error('Failed to add member');
    }
  };

  const onRemove = async (userId: string) => {
    try {
      await removeMember({ id: id!, body: { userId } }).unwrap();
      toast.success('Member removed');
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

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

      <div className="flex w-full h-full items-start">
        <div className="h-full w-[40%] border-r px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[28px]">Members</h3>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-right-5 cut-left-5">
                  <PlusIcon className="w-5 h-5 mr-1" />
                  Add member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                  <DialogTitle>Add member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={onAddMember}
                    disabled={adding}
                    className="bg-[--main-button] hover:bg-[--main-button-hover]"
                  >
                    {adding ? 'Adding…' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {isFetching && <div className="text-sm opacity-70">Loading members…</div>}
            {isSuccess &&
              data?.items?.map((member: IUserResponse) => (
                <div
                  key={String(member.id)}
                  className="flex w-full p-2 items-center gap-3 hover:bg-transparent/10 rounded-lg"
                >
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={member?.avatar ? `${api}/file/${member.avatar}` : undefined} alt="avatar" />
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-[--accent-text] truncate">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-xs opacity-70 truncate">{member.email}</div>
                  </div>
                  <div className="flex flex-1 justify-end gap-2">
                    {/* <EditIcon className="cursor-pointer" />  role change later */}
                    <TrashIcon className="cursor-pointer" onClick={() => onRemove(String(member.id))} />
                  </div>
                </div>
              ))}
            {isSuccess && (!data?.items || data.items.length === 0) && (
              <div className="text-sm opacity-70">No members yet.</div>
            )}
          </div>
        </div>

        <div className="h-full w-full px-4 py-3">
          <h3 className="text-[32px]">Project</h3>
          {/* project info here */}
        </div>
      </div>
    </div>
  );
}
