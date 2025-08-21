import { CheckCheckIcon, CircleDotIcon, CodeXmlIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TaskStatusEnum } from '@/enums/task-status.enum';
import { useEditTaskMutation } from '@/services/task';

const TaskStatus = ({ id, defaultStatus }: { id: string; defaultStatus: TaskStatusEnum }) => {
  const [editTask] = useEditTaskMutation();
  const [status, setStatus] = useState<TaskStatusEnum>(defaultStatus);

  const handleStatusChange = (newStatus: TaskStatusEnum) => {
    setStatus(newStatus);
    editTask({ id, status: newStatus });
  };

  return (
    <div className="w-full h-auto max-w-sm lg:max-w-full p-4 flex items-center justify-between">
      <Button
        className="w-[8em] bg-transparent rounded-none hover:bg-[--main-button-hover] flex items-center space-x-1 cursor-pointer cut cut-right-5 cut-left-5"
        onClick={() => handleStatusChange(TaskStatusEnum.TODO)}
      >
        {status === TaskStatusEnum.TODO || status === TaskStatusEnum.IN_PROGRESS || status === TaskStatusEnum.DONE ? (
          <>
            <CircleDotIcon className="text-red-200" />
            <p className="font-medium text-red-200">To Do</p>
          </>
        ) : (
          <>
            <CircleDotIcon className="text-green-300" />
            <p className="font-medium text-red-200">To Do</p>
          </>
        )}
      </Button>
      <div
        className={`bg-gray-500 w-full h-[1px] ${
          status === TaskStatusEnum.IN_PROGRESS || status === TaskStatusEnum.DONE
            ? 'bg-gradient-to-r from-red-300 to-yellow-100'
            : ''
        }`}
      />
      <Button
        className="w-[8em] bg-transparent rounded-none hover:bg-[--main-button-hover] flex items-center space-x-1 cursor-pointer cut cut-right-5 cut-left-5"
        onClick={() => handleStatusChange(TaskStatusEnum.IN_PROGRESS)}
      >
        {status === TaskStatusEnum.IN_PROGRESS || status === TaskStatusEnum.DONE ? (
          <>
            <CodeXmlIcon className="text-yellow-100" />
            <p className="font-medium text-yellow-100">In Progress</p>
          </>
        ) : (
          <>
            <CodeXmlIcon className="text-gray-400" />
            <p className="font-medium text-gray-400">In Progress</p>
          </>
        )}
      </Button>
      <div
        className={`bg-gray-500 w-full h-[1px] ${
          status === TaskStatusEnum.DONE ? 'bg-gradient-to-r from-yellow-200 to-green-300' : ''
        }`}
      />
      <Button
        className="w-[8em] bg-transparent rounded-none hover:bg-[--main-button-hover] flex items-center space-x-1 cursor-pointer cut cut-right-5 cut-left-5"
        onClick={() => handleStatusChange(TaskStatusEnum.DONE)}
      >
        {status === TaskStatusEnum.DONE ? (
          <>
            <CheckCheckIcon className="text-green-200" />
            <p className="font-medium text-green-200">Done</p>
          </>
        ) : (
          <>
            <CheckCheckIcon className="text-gray-400" />
            <p className="font-medium text-gray-400">Done</p>
          </>
        )}
      </Button>
    </div>
  );
};

export default TaskStatus;
