import { FileCheckIcon, FolderCodeIcon, KanbanIcon, MessageSquareIcon, UsersIcon } from 'lucide-react';

import { ROUTES } from '@/router';

export const navigationList = [
  {
    title: 'Projects',
    url: ROUTES.PROJECTS,
    icon: FolderCodeIcon,
  },
  {
    title: 'Tasks',
    url: ROUTES.TASKS,
    icon: FileCheckIcon,
  },
  {
    title: 'Activity',
    url: ROUTES.ACTIVITY,
    icon: KanbanIcon,
  },
  {
    title: 'Chats',
    icon: MessageSquareIcon,
    url: ROUTES.CHATS,
  },
  {
    title: 'Peoples ',
    url: ROUTES.USERS,
    icon: UsersIcon,
  },
];
