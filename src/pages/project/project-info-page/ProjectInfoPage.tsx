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
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  useAddMemberMutation,
  useGetMembersQuery,
  useGetProjectByIdQuery,
  useRemoveMemberMutation,
} from '@/services/project';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export default function ProjectInfoPage() {
  const { id } = useParams<string>();
  const { isMobile } = useSidebar();

  const { data } = useGetProjectByIdQuery({ id: id! });
  const { data: members, isSuccess, isFetching } = useGetMembersQuery({ id: id! });
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
        {isMobile && <SidebarTrigger className="-ml-1" />}
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
        <div className="h-full w-full px-4 py-3 space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-semibold">{data?.name ?? 'Untitled project'}</div>
                  <div className="text-sm opacity-80 mt-1">{data?.description ?? 'No description yet.'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-white/5 border">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">Owner</span>
                  <span>—</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">Created</span>
                  <span>{data?.createdAt?.slice(0, 10) ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">Updated</span>
                  <span>—</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-60">Visibility</span>
                  <span>Private</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border p-4 space-y-3">
              <div className="text-base font-medium">Quick stats</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs opacity-70">Tasks</div>
                  <div className="text-xl font-semibold">{0}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs opacity-70">Done</div>
                  <div className="text-xl font-semibold">{0}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs opacity-70">Members</div>
                  <div className="text-xl font-semibold">{members?.items.length ?? 0}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs opacity-70">Threads</div>
                  <div className="text-xl font-semibold">{0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones / Roadmap */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-medium">Roadmap & Milestones</div>
              <Button
                size="sm"
                className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-right-4 cut-left-4"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add milestone
              </Button>
            </div>

            {/* {data?.milestones?.length ? ( */}
            {/*  <div className="space-y-2"> */}
            {/*    {data.milestones.map((m: any) => ( */}
            {/*      <div key={m.id} className="flex items-center justify-between rounded-lg border p-3"> */}
            {/*        <div> */}
            {/*          <div className="font-medium">{m.title}</div> */}
            {/*          <div className="text-xs opacity-70"> */}
            {/*            Due {m.dueDate?.slice(0,10) ?? '—'} • {m.status ?? 'Planned'} */}
            {/*          </div> */}
            {/*        </div> */}
            {/*        <div className="text-sm opacity-80"> */}
            {/*          {m.progress != null ? `${m.progress}%` : '0%'} */}
            {/*        </div> */}
            {/*      </div> */}
            {/*    ))} */}
            {/*  </div> */}
            {/* ) : ( */}
            <div className="text-sm opacity-70">No milestones yet.</div>
            {/* )} */}
          </div>

          {/* Links / Docs / Repos */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-medium">Links & Docs</div>
              <Button size="sm" variant="outline" className="rounded-none cut cut-right-4 cut-left-4">
                <PlusIcon className="w-4 h-4 mr-1" />
                Add link
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="text-sm opacity-70">No links yet.</div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border p-4">
            <div className="text-base font-medium mb-2">Recent activity</div>
            {/* {data?.activity?.length ? ( */}
            {/*  <div className="space-y-2"> */}
            {/*    {data.activity.slice(0,10).map((a: any) => ( */}
            {/*      <div key={a.id} className="flex items-start gap-3 text-sm"> */}
            {/*        <div className="mt-1 size-2 rounded-full bg-white/60" /> */}
            {/*        <div> */}
            {/*          <div className="opacity-90"> */}
            {/*            <span className="font-medium">{a.actor?.name ?? 'Someone'}</span>{' '} */}
            {/*            {a.action ?? 'did something'} */}
            {/*          </div> */}
            {/*          <div className="opacity-60 text-xs"> */}
            {/*            {a.createdAt?.slice(0,16) ?? '—'} */}
            {/*          </div> */}
            {/*        </div> */}
            {/*      </div> */}
            {/*    ))} */}
            {/*  </div> */}
            {/* ) : ( */}
            <div className="text-sm opacity-70">No activity yet.</div>
            {/* )} */}
          </div>

          {/* Tags / Category & Integrations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-medium">Tags & Category</div>
                <Button size="sm" variant="outline" className="rounded-none cut cut-right-4 cut-left-4">
                  Manage
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* {(data?.project?.tags ?? []).map((t: string) => ( */}
                {/*  <span key={t} className="text-xs px-2 py-1 rounded border">{t}</span> */}
                {/* ))} */}
                <div className="text-sm opacity-70">No tags yet.</div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-base font-medium mb-2">Integrations</div>
              <div className="flex flex-wrap gap-2">
                {['GitHub', 'Notion', 'Drive'].map((i: string) => (
                  <span key={i} className="text-xs px-2 py-1 rounded border">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[30%] border-l px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px]">Members</h3>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-right-5 cut-left-5">
                  <PlusIcon className="w-5 h-5" />
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
              members?.items?.map((member: IUserResponse) => (
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
                    {/* <EditIcon className="cursor-pointer" /> role change later */}
                    <TrashIcon className="cursor-pointer" onClick={() => onRemove(String(member.id))} />
                  </div>
                </div>
              ))}
            {isSuccess && (!members?.items || members.items.length === 0) && (
              <div className="text-sm opacity-70">No members yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
