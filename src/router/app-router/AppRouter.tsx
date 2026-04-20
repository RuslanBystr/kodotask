import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { FlippableAuthCard } from '@/components/forms/auth/FlipForm';
import { AuthGuard, GuestGuard } from '@/guards';
import { AuthLayout, MainLayout } from '@/layouts';
import { ActivityPage } from '@/pages/activity/activity.page';
import AIChat from '@/pages/ai-chat/ai-chat.page';
import AuthSuccess from '@/pages/auth-success/AuthSuccess';
import MainGroupChatPage from '@/pages/chat/group-chat/MainGroupChatPage';
import MainChatPage from '@/pages/chat/private-chat/MainChatPage';
import { MainHomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { CreateProjectPage } from '@/pages/project/create-project-page';
import { EditProjectPage } from '@/pages/project/edit-project-page';
import { MainProjectPage } from '@/pages/project/main-project-page';
import { ProjectInfoPage } from '@/pages/project/project-info-page';
import { SettingsPage } from '@/pages/settings/settings.page';
import { SupportPage } from '@/pages/support';
import CreateTaskPage from '@/pages/task/create-task-page/CreateTaskPage';
import MainTaskPage from '@/pages/task/main-task-page/MainTaskPage';
import TaskInfoPage from '@/pages/task/task-info/TaskInfo';
import { VerificationPage } from '@/pages/verification';
import { ROUTES } from '@/router/constants';

import { CreateUserPage, EditUserPage, MainUserPage } from '../../pages/users';

export const AppRouter: React.FC = (): React.ReactElement | null =>
  useRoutes([
    {
      path: ROUTES.AUTH.ROOT,
      element: (
        <GuestGuard>
          <AuthLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: ROUTES.AUTH.ROOT,
          element: <FlippableAuthCard />,
        },
        {
          path: `${ROUTES.AUTH.SUCCESS}`,
          element: <AuthSuccess />,
        },
        {
          path: `${ROUTES.AUTH.ROOT}/verification`,
          element: <VerificationPage />,
        },
      ],
    },
    {
      path: ROUTES.HOME,
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { index: true, element: <MainHomePage /> },
        {
          path: ROUTES.HOME,
          element: <MainHomePage />,
        },
        {
          path: ROUTES.AI_CHAT,
          element: <AIChat />,
        },
        {
          path: `${ROUTES.AI_CHAT}/thread/:threadId`,
          element: <AIChat />,
        },
        {
          path: ROUTES.USERS,
          element: <MainUserPage />,
        },
        {
          path: `${ROUTES.USERS}/edit/:id`,
          element: <EditUserPage />,
        },
        {
          path: `${ROUTES.USERS}/create`,
          element: <CreateUserPage />,
        },
        {
          path: ROUTES.PROJECTS,
          element: <MainProjectPage />,
        },
        {
          path: `${ROUTES.PROJECTS}/:id`,
          element: <ProjectInfoPage />,
        },
        {
          path: `${ROUTES.PROJECTS}/create`,
          element: <CreateProjectPage />,
        },
        {
          path: `${ROUTES.PROJECTS}/edit/:id`,
          element: <EditProjectPage />,
        },
        {
          path: ROUTES.TASKS,
          element: <MainTaskPage />,
        },
        {
          path: `${ROUTES.TASKS}/create`,
          element: <CreateTaskPage />,
        },
        {
          path: `${ROUTES.TASKS}/:id`,
          element: <TaskInfoPage />,
        },
        {
          path: ROUTES.ACTIVITY,
          element: <ActivityPage />,
        },
        {
          path: ROUTES.CHATS,
          element: <MainChatPage />,
        },
        {
          path: `${ROUTES.CHATS}/user/:id`,
          element: <MainChatPage />,
        },
        {
          path: ROUTES.GROUPS,
          element: <MainGroupChatPage />,
        },
        {
          path: `${ROUTES.GROUPS}/:id`,
          element: <MainGroupChatPage />,
        },
        {
          path: ROUTES.SUPPORT,
          element: <SupportPage />,
        },
        {
          path: ROUTES.SETTINGS,
          element: <SettingsPage />,
        },
      ],
    },
    { path: '404', element: <NotFoundPage /> },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
