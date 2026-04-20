import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { selectAuthenticatedUserSelector } from '@/store';
import { selectWorkspaceId } from '@/store/workspace/selectors';
import { setWorkspace } from '@/store/workspace/slice';
import { getEnv } from '@/utils';

const { api } = getEnv();

interface Workspace {
  id: string;
  name: string;
}

const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Main Workspace' },
  { id: 'ws-2', name: 'Startup Project' },
  { id: 'ws-3', name: 'Pet Project' },
];

export function NavUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector(selectAuthenticatedUserSelector);
  const currentWorkspaceId = useSelector(selectWorkspaceId);

  const workspaces: Workspace[] = useMemo(
    () => (userData?.workspaces?.length ? userData.workspaces : MOCK_WORKSPACES),
    [userData?.workspaces],
  );

  useEffect(() => {
    if (!currentWorkspaceId && workspaces.length > 0) {
      dispatch(setWorkspace(workspaces[0].id));
    }
  }, [currentWorkspaceId, workspaces, dispatch]);

  const handleWorkspaceChange = (workspaceId: string) => {
    if (workspaceId === currentWorkspaceId) return;

    dispatch(setWorkspace(workspaceId));

    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <SidebarMenu className="flex flex-col">
      {/* WORKSPACE SELECT */}
      <Select
        value={currentWorkspaceId ?? undefined}
        onValueChange={handleWorkspaceChange}
        disabled={workspaces.length === 0}
      >
        <SelectTrigger className="w-full h-6 rounded-sm">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>

        <SelectContent>
          {workspaces.map((ws) => (
            <SelectItem key={ws.id} value={ws.id}>
              {ws.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* PROFILE */}
      <SidebarMenuItem>
        <SidebarMenuButton className="cursor-default bg-transparent/20 md:bg-muted/60 rounded-sm">
          <div className="flex items-center justify-center w-5 h-5 shrink-0">
            <Avatar className="w-6 h-6 rounded-md">
              <AvatarImage src={`${api}/file/${userData?.avatar}`} alt={userData?.firstName} />
              <AvatarFallback className="rounded-md text-[10px]">
                {userData ? userData.firstName[0] + userData.lastName[0] : 'AA'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {userData?.firstName} {userData?.lastName}
            </span>
            <span className="truncate text-xs">{userData?.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
