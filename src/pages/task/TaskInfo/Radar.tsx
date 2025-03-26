'use client';

import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { ITaskResponse } from '@/types/responses/IProjectResponse';

const chartDataMock = [
  { status: 'done', tasks: 287, fill: '#4CAF50' },
  { status: 'inProgress', tasks: 173, fill: '#64B5F6' },
  { status: 'remaining', tasks: 190, fill: '#FFD54F' },
];

const chartConfig = {
  done: {
    label: 'Done',
    color: '#4A5A62',
  },
  inProgress: {
    label: 'In Progress',
    color: '#3B474D',
  },
  remaining: {
    label: 'Remaining',
    color: '#2F3D44',
  },
} satisfies ChartConfig;

const calculateProgress = (spentTime: number, estimate: number) => {
  if (estimate === 0) return 0;
  return Math.min((spentTime / estimate) * 100, 100);
};

export function TaskDiagram({ data }: { data: ITaskResponse }) {
  const progress = calculateProgress(data.spentTime, data.estimate);
  const totalTime = useMemo(() => chartDataMock.reduce((acc, curr) => acc + curr.tasks, 0), []);

  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="items-center py-4">
        <CardTitle>Task Overview</CardTitle>
        <CardDescription>A breakdown of task status and key performance metrics.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartDataMock} dataKey="tasks" nameKey="status" innerRadius={60} strokeWidth={5} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          In Developing {totalTime}m<TrendingUp className="h-4 w-4" />
        </div>
        <div className="w-full p-3 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p>
                <strong>Status:</strong>
              </p>
              <p>
                <strong>Priority:</strong>
              </p>
              <p>
                <strong>Started:</strong>
              </p>
              <p>
                <strong>Deadline:</strong>
              </p>
              <p>
                <strong>Estimate:</strong>
              </p>
              <p>
                <strong>Spent time:</strong>
              </p>
              <p>
                <strong>Remaining:</strong>
              </p>
              <p>
                <strong>Done:</strong>
              </p>
              <p>
                <strong>Assignee:</strong>
              </p>
              <p>
                <strong>Author:</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>{data.status}</p>
              <p>{data.priority}</p>
              <p>{new Date(data.createdAt).toLocaleDateString()}</p>
              <p>{data.deadline ? new Date(data.deadline).toLocaleDateString() : '-'}</p>
              <p>{data.estimate}m</p>
              <p>{data.spentTime}m</p>
              <p>{data.remaining}m</p>
              <Progress className="" value={progress || 0} />
              <p>
                {data.assignedUser.firstName} {data.assignedUser.lastName}
              </p>
              <p>{data.author}</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
