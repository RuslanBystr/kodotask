import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { DeleteTaskDialog } from '@/components/modals/task-modal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TaskStatusEnum } from '@/enums/task-status.enum';
import { TaskDiagram } from '@/pages/task/task-info/Radar';
import { SpendTime } from '@/pages/task/task-info/SpendTime';
import { TaskActivity } from '@/pages/task/task-info/TaskActivity';
import TaskStatus from '@/pages/task/task-info/TaskStatusBlock';
import { useEditTaskMutation, useGetTaskByIdQuery } from '@/services/task';

export default function TaskInfoPage() {
  const { id } = useParams<string>();
  const taskId = id ?? '';
  const { data, isLoading, refetch } = useGetTaskByIdQuery(taskId);
  const [editTask] = useEditTaskMutation();

  // editor value (single source of truth for the editor)
  const [localValue, setLocalValue] = useState('');
  // optional: small save status
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (data?.description != null) {
      setLocalValue(data.description);
      lastSavedRef.current = data.description;
    }
  }, [data?.description]);

  const debouncedSave = useMemo(
    () =>
      debounce(600, async (value: string) => {
        try {
          if (value === lastSavedRef.current) return;
          setSaveState('saving');
          await editTask({ id: taskId, description: value }).unwrap();
          lastSavedRef.current = value;
          setSaveState('saved');
          setTimeout(() => setSaveState('idle'), 1000);
        } catch {
          setSaveState('error');
        }
      }),
    [editTask, taskId],
  );

  useEffect(
    () => () => {
      debouncedSave.cancel();
    },
    [debouncedSave],
  );

  const tabs = [
    { id: 'tab1', label: 'Time', content: <SpendTime logs={data?.timeLogger} refreshTask={refetch} /> },
    {
      id: 'tab2',
      label: 'Status',
      content: <TaskStatus id={taskId} defaultStatus={data?.status || TaskStatusEnum.TODO} />,
    },
    { id: 'tab3', label: 'Activity', content: <TaskActivity data={data?.timeLogger || []} /> },
  ];

  const [activeTab, setActiveTab] = useState('tab1');

  if (isLoading) {
    return (
      <div className="p-2">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/tasks">Task</BreadcrumbLink>
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
              <BreadcrumbLink href="/tasks">Task</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">{data?.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-0 w-full h-auto max-h-screen">
        <div className="w-full grid md:grid-cols-3 h-auto md:h-[93vh]">
          <div className="w-full border-r row-span-1 md:col-span-2 flex flex-col max-h-[93vh]">
            <ResizablePanelGroup direction="vertical" className="h-[70vh] w-full bg-muted/20 min-h-0">
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col min-h-0">
                  <div className="shrink-0 flex space-x-2 p-2">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        className={`border-b-2 rounded-none cut cut-top-right-5 cut-top-left-5 hover:bg-accent/20 ${
                          activeTab === tab.id ? 'bg-accent' : 'bg-transparent'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex-1 flex flex-col-reverse min-h-0 h-full w-full overflow-y-auto custom-scrollbar">
                    <div className="p-4 text-center">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={60} minSize={20} className="shadow-md">
                <div className="h-full flex flex-col min-h-0">
                  <div className="flex items-center justify-between pr-3">
                    <Label className="shrink-0 my-2 ml-2">Notes</Label>
                    {/* tiny save indicator (optional) */}
                    <span className="text-xs opacity-70">
                      {saveState === 'saving' && 'Saving…'}
                      {saveState === 'saved' && 'Saved'}
                      {saveState === 'error' && 'Save failed'}
                    </span>
                  </div>

                  <ReactQuill
                    className="flex-1 min-h-0 h-auto bg-muted/20 border-none rounded-none custom-quill"
                    theme="snow"
                    value={localValue}
                    onChange={(content) => {
                      setLocalValue(content);
                      debouncedSave(content);
                    }}
                    onBlur={() => debouncedSave.cancel()}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <div className="w-full mb-16">
            <div className="flex justify-end">{id && <DeleteTaskDialog taskId={id} />}</div>
            {data && <TaskDiagram data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}
