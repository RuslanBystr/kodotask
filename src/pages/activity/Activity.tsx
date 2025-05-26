import React, { useEffect, useState } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ActivityChart } from '@/pages/activity/BarChart';

const ActivityPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState([
    {
      id: 1,
      message: 'hello',
      created_at: '2021-09-20T12:00:00.000Z',
    },
  ]);

  useEffect(() => {
    setData([
      {
        id: 1,
        message: `task name: ${selectedDate}`,
        created_at: '2021-09-20T12:00:00.000Z',
      },
      {
        id: 2,
        message: `task test: ${selectedDate}`,
        created_at: '2021-09-20T12:00:00.000Z',
      },
      {
        id: 3,
        message: `task name`,
        created_at: '2021-09-20T12:00:00.000Z',
      },
      {
        id: 4,
        message: `feat: new task for test`,
        created_at: '2021-09-20T12:00:00.000Z',
      },
    ]);
  }, [selectedDate]);

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Activity</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex relative w-full h-full">
        <ActivityChart className="bg-transparent rounded-none border-none" setSelectedDate={setSelectedDate} />
        <div className="w-full h-full p-6">
          <h3>Logs {selectedDate}</h3>

          {data.map((log) => (
            <div
              key={log.id}
              className="flex w-full gap-4 hover:bg-transparent/10 py-2 cursor-pointer border-b-2 justify-between"
            >
              <p>{log.message}</p>
              <p>{new Date(log.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
