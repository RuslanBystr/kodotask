import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatusEnum } from '@/constants/enums/task-status.enum';
import { TaskDiagram } from '@/pages/task/TaskInfo/Radar';
import { TaskActivity } from '@/pages/task/TaskInfo/TaskActivity';
import TaskStatus from '@/pages/task/TaskInfo/TaskStatusBlock';
import { useEditTaskMutation, useGetTaskByIdQuery } from '@/services/task';

export default function TaskInfoPage() {
  const { id } = useParams<string>();
  const taskId = id ?? '';
  const { data, isLoading } = useGetTaskByIdQuery(taskId);
  const [editTask] = useEditTaskMutation();
  const [activeTab, setActiveTab] = useState('tab1');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (data?.description) {
      setDescription(data?.description);
    }
  }, [data]);

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    editTask({ id: taskId, description: e.target.value });
  };

  const chartData = [
    { metric: 'Status Progress', value: 66 },
    { metric: 'Spent Time', value: 80 },
    { metric: 'Estimated Time', value: 50 },
    { metric: 'Priority', value: 90 },
    { metric: 'Complexity', value: 70 },
  ];

  const tabs = [
    { id: 'tab1', label: 'Time', content: '' },
    {
      id: 'tab2',
      label: 'Status',
      content: <TaskStatus id={taskId} defaultStatus={data?.status || TaskStatusEnum.TODO} />,
    },
    { id: 'tab3', label: 'Activity', content: <TaskActivity /> },
  ];

  if (isLoading) {
    return (
      <div className="p-2">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href=".">Task</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      </div>
    );
  }
  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href=".">Task</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">{data?.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-0">
        <div className="flex justify-between h-[85vh]">
          <div className="w-full border-r">
            <div className="h-[16em]">
              <div className="h-[60vh] w-full bg-muted/20">
                <div className="flex space-x-2 p-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      className={
                        activeTab === tab.id
                          ? 'bg-accent/20 border-b-2 rounded-b-none shadow'
                          : 'bg-transparent border-b-2 rounded-b-none shadow'
                      }
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                <div>
                  <div className="p-4 text-center">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                </div>
              </div>
              <Label>Notes</Label>
              <Textarea
                className="h-full border-none rounded-none bg-muted/20"
                value={description}
                onChange={handleDescChange}
              />
            </div>
          </div>
          {data && <TaskDiagram data={data} chartData={chartData} />}
        </div>
      </div>
    </div>
  );
}
