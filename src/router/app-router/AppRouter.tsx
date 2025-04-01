import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { AuthGuard, GuestGuard } from '@/guards';
import { AuthLayout, MainLayout } from '@/layouts';
import ActivityPage from '@/pages/activity/Activity';
import AuthSuccess from '@/pages/auth-success/AuthSuccess';
import MainChatPage from '@/pages/chat/main-chat-page/MainChatPage';
import MainGroupChatPage from '@/pages/chat/main-group-chat-page/MainGroupChatPage';
import { CreateProjectPage } from '@/pages/project/CreateProjectPage';
import { EditProjectPage } from '@/pages/project/EditProjectPage';
import MainProjectPage from '@/pages/project/MainProjectPage/MainProjectPage';
import { SignIn } from '@/pages/sign-in';
import CreateTaskPage from '@/pages/task/CreateTaskPage/CreateTaskPage';
import MainTaskPage from '@/pages/task/MainTaskPage/MainTaskPage';
import TaskInfoPage from '@/pages/task/TaskInfo/TaskInfo';
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
          element: <SignIn />,
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
        { index: true, element: <MainProjectPage /> },
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
    { path: '404', element: '' },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
