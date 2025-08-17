import { QueryActionCreatorResult, QueryDefinition } from '@reduxjs/toolkit/query';
import { TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useToastMessageRequest from '@/hooks/useToastMessageRequest';
import { useDeleteTaskLogMutation, useSpendTimeMutation } from '@/services/task';
import { ITaskLog } from '@/types/responses/IProjectResponse';
import { timeFormat } from '@/utils/time-format';

export const SpendTime = ({
  logs = [],
  refreshTask,
}: {
  logs?: ITaskLog[];
  // eslint-disable-next-line
  refreshTask: () => QueryActionCreatorResult<QueryDefinition<any, any, any, any, string>>;
}) => {
  const { id } = useParams();
  const taskId = id ?? '';

  const [time, setTime] = useState('');
  const [spendTime, { isSuccess: isSpendSuccess, isError: isSpendError, error: spendError }] = useSpendTimeMutation();
  const [deleteTaskLog, { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] =
    useDeleteTaskLogMutation();
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  const dateFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs?.length]);

  useToastMessageRequest({ isSuccess: isSpendSuccess, isError: isSpendError, error: spendError });
  useToastMessageRequest({ isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError });

  const handleSubmit = () => {
    if (!time || Number.isNaN(Number(time))) return;
    spendTime({ id: taskId, body: { duration: Number(time) } }).then(() => {
      setTime('');
      refreshTask();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeleteTime = async (logId: string) => {
    await deleteTaskLog(logId);
    refreshTask();
  };

  return (
    <div className="h-auto flex flex-col justify-between max-w-[720px]">
      <div ref={logContainerRef} className="flex-1 overflow-y-auto bg-muted/20 p-2">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={`task-log-${log.loggedAt}`}
              className="flex justify-between items-center border-b border-gray-500 py-1 md:px-4"
            >
              <div>{timeFormat(log.duration)}</div>
              <div className="text-[12px]">{dateFormat(log.loggedAt)}</div>
              <div>
                <Button
                  variant="ghost"
                  className="rounded-none cut cut-top-5 cut-bottom-5"
                  onClick={() => handleDeleteTime(log.id)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No logs yet</div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 bg-muted/20">
        <Input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter time in minutes"
          onKeyDown={handleKeyDown}
          className="rounded-none"
        />
        <Button
          className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-left-5 cut-right-5"
          onClick={handleSubmit}
        >
          Log Time
        </Button>
      </div>
    </div>
  );
};
