import { TaskPriorityEnum } from '@/constants/enums/task-priority.enum';
import { TaskStatusEnum } from '@/constants/enums/task-status.enum';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  started: string;
  deadline?: string | null;
  estimate: number;
  spentTime: number;
  remaining: number;
  author: string;
  project: {
    id: string;
    name: string;
  };
  assignedUser: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface ITaskLog {
  id: string;
  duration: number;
  loggedAt: string;
}

export interface ITaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  started: string;
  deadline?: string | null;
  estimate: number;
  spentTime: number;
  remaining: number;
  author: string;
  timeLogger: ITaskLog[];
  project: {
    id: string;
    name: string;
  };
  assignedUser: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface IProjectResponse {
  id: number;
  name: string;
  description: string;
  image?: string;
  tasks: Task[];
  createdAt: string;
}
