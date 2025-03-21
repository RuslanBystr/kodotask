const AUTH_ROOT = '/auth';

export const ROUTES = {
  AUTH: {
    ROOT: AUTH_ROOT,
    SUCCESS: `${AUTH_ROOT}/success`, // Тепер це '/auth/success'
  },
  HOME: '/',
  USERS: '/users',
  TASKS: '/tasks',
  ACTIVITY: '/activity',
  PROJECTS: '/projects',
  CHATS: '/chats',
  GROUPS: '/groups',
};
