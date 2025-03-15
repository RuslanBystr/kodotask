import { QueryActionCreatorResult, QueryDefinition } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpendTimeMutation } from '@/services/task';
import { ITaskLog } from '@/types/responses/IProjectResponse';

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
  const [spendTime] = useSpendTimeMutation();
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  const timeFormat = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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

  const handleSubmit = async () => {
    if (!time || Number.isNaN(Number(time))) return;
    await spendTime({ id: taskId, body: { duration: Number(time) } });
    setTime('');
    refreshTask();
  };

  return (
    <div className="h-[40vh] flex flex-col justify-between max-w-[720px]">
      <div ref={logContainerRef} className="flex-1 overflow-y-auto bg-muted/20 rounded-lg p-2">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={`task-log-${log.loggedAt}`} className="flex justify-between border-b border-gray-500 py-1 md:px-4">
              <div>{timeFormat(log.duration)}</div>
              <div>{dateFormat(log.loggedAt)}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No logs yet</div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter time in minutes"
        />
        <Button className="bg-card hover:bg-card/30 rounded-none" onClick={handleSubmit}>
          Log Time
        </Button>
      </div>
    </div>
  );
};
