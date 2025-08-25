import {
  FileCheckIcon,
  FolderCodeIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  MessageCircleCodeIcon,
  MessageSquareIcon,
  Sparkles,
  UsersIcon,
} from 'lucide-react';

import { ROUTES } from '@/router';

export const navigationList = [
  {
    title: 'Dashboard',
    url: ROUTES.HOME,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'AI Workspace',
    url: ROUTES.AI_CHAT,
    icon: Sparkles,
  },
  {
    title: 'Projects',
    url: ROUTES.PROJECTS,
    icon: FolderCodeIcon,
  },
  {
    title: 'Task Board',
    url: ROUTES.TASKS,
    icon: FileCheckIcon,
  },
  {
    title: 'Activity Log',
    url: ROUTES.ACTIVITY,
    icon: KanbanIcon,
  },
  {
    title: 'Direct Messages',
    icon: MessageSquareIcon,
    url: ROUTES.CHATS,
  },
  {
    title: 'Team Channels',
    icon: MessageCircleCodeIcon,
    url: ROUTES.GROUPS,
  },
  {
    title: 'Members',
    url: ROUTES.USERS,
    icon: UsersIcon,
  },
];
