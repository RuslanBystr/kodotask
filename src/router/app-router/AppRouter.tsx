import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { FlippableAuthCard } from '@/components/forms/auth/FlipForm';
import { AuthGuard, GuestGuard } from '@/guards';
import { AuthLayout, MainLayout } from '@/layouts';
import ActivityPage from '@/pages/activity/Activity';
import AuthSuccess from '@/pages/auth-success/AuthSuccess';
import MainChatPage from '@/pages/chat/main-chat-page/MainChatPage';
import MainGroupChatPage from '@/pages/chat/main-group-chat-page/MainGroupChatPage';
import { MainHomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { CreateProjectPage } from '@/pages/project/create-project-page';
import { EditProjectPage } from '@/pages/project/edit-project-page';
import { MainProjectPage } from '@/pages/project/main-project-page';
import { ProjectInfoPage } from '@/pages/project/project-info-page';
import CreateTaskPage from '@/pages/task/create-task-page/CreateTaskPage';
import MainTaskPage from '@/pages/task/main-task-page/MainTaskPage';
import TaskInfoPage from '@/pages/task/task-info/TaskInfo';
import { ROUTES } from '@/router/constants';

import { CreateUserPage, EditUserPage, MainUserPage } from '../../pages/Users';

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
          path: `${ROUTES.CHATS}`,
          element: <MainChatPage />,
        },
        {
          path: `${ROUTES.CHATS}/user/:id`,
          element: <MainChatPage />,
        },
        {
          path: `${ROUTES.GROUPS}`,
          element: <MainGroupChatPage />,
        },
        {
          path: `${ROUTES.GROUPS}/:id`,
          element: <MainGroupChatPage />,
        },
      ],
    },
    { path: '404', element: <NotFoundPage /> },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
