"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from '@/components/ui/progress';
import { ITaskResponse } from '@/types/responses/IProjectResponse';

const chartConfig = {
  value: {
    label: "Task Metrics",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


interface IChartData {
  metric: string;
  value: number;
}

export function TaskDiagram({data, chartData}: { data: ITaskResponse, chartData: IChartData[]} ) {
  return (
    <Card className="flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="items-center py-4">
        <CardTitle>Task Overview</CardTitle>
        <CardDescription>A breakdown of task status and key performance metrics.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-metrics)"
              fillOpacity={0.5}
              dot={{
                r: 3,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 7.8% this week <TrendingUp className="h-4 w-4" />
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
              <Progress className='' value={data.done} />
              <p>{data.assignedUser.firstName} {data.assignedUser.lastName}</p>
              <p>{data.author}</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
