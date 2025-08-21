'use client';

import { TrendingUp } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ITaskResponse } from '@/types/responses/IProjectResponse';
import { timeFormat } from '@/utils/time-format';

type CenterLabelProps = {
  viewBox?: { cx: number; cy: number };
  top: string;
  bottom: string;
  color?: string;
};

function CenterLabel({ viewBox, top, bottom, color = '#5fa8a9' }: CenterLabelProps): ReactElement {
  const { cx = 0, cy = 0 } = viewBox ?? {};
  return (
    <g>
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="20"
        fontWeight={700}
        fill={color}
      >
        {top}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central" fontSize="12" opacity={0.7} fill={color}>
        {bottom}
      </text>
    </g>
  );
}

const chartDataMock = [
  { status: 'done', tasks: 287, fill: '#4E6A74' },
  { status: 'inProgress', tasks: 173, fill: '#5F8291' },
];
const chartConfig = {
  done: { label: 'Done', color: '#4A5A62' },
  inProgress: { label: 'In Progress', color: '#3B474D' },
} satisfies ChartConfig;

const calculateProgress = (spentTime: number, estimate: number) => {
  if (!estimate) return 0;
  return Math.min((spentTime / estimate) * 100, 100);
};

export function TaskDiagram({ data }: { data: ITaskResponse }) {
  const progress = calculateProgress(data.spentTime, data.estimate);
  const topText = `${Math.round(progress)}%`;
  const bottomText = `${timeFormat(data.spentTime)} / ${timeFormat(data.estimate)}`;

  const progressData = useMemo(() => {
    const spent = Math.max(Math.min(data.spentTime, data.estimate), 0);
    const remaining = Math.max(data.estimate - data.spentTime, 0);
    const epsilon = spent + remaining === 0 ? 1 : 0;
    return [
      { name: 'spent', value: spent + (epsilon ? 0 : 0) },
      { name: 'remaining', value: remaining + epsilon },
    ];
  }, [data.spentTime, data.estimate]);

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
            <Pie
              data={chartDataMock}
              dataKey="tasks"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              isAnimationActive={false}
            >
              {chartDataMock.map((d) => (
                <Cell key={d.status} fill={d.fill} />
              ))}
            </Pie>

            <Pie
              data={progressData}
              dataKey="value"
              nameKey="name"
              startAngle={90}
              endAngle={-270}
              innerRadius={84}
              outerRadius={100}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="#a5d2dc" />
              <Cell fill="hsl(var(--muted))" />
              <Label position="center" content={<CenterLabel top={topText} bottom={bottomText} color="#5fa8a9" />} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          In Developing {totalTime}m <TrendingUp className="h-4 w-4" />
        </div>

        <div className="w-full p-3 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p>
                <strong>Assignee:</strong>
              </p>
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
                <strong>Estimate:</strong>
              </p>
              <p>
                <strong>Spent time:</strong>
              </p>
              <p>
                <strong>Remaining:</strong>
              </p>
              <p>
                <strong>Author:</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                {data.assignedUser.firstName} {data.assignedUser.lastName}
              </p>
              <p>{data.status}</p>
              <p>{data.priority}</p>
              <p>{new Date(data.createdAt).toLocaleDateString()}</p>
              <p>{timeFormat(data.estimate)}</p>
              <p>{timeFormat(data.spentTime)}</p>
              <p>{timeFormat(data.remaining)}</p>
              <p>{data.author}</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
