'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ITaskLog } from '@/types/responses/IProjectResponse';
import { timeFormat } from '@/utils/time-format';

const chartConfig = {
  duration: {
    label: 'Total time',
    color: 'hsl(var(--chart-1))',
  },
  // loggedAt: {
  //   label: 'Development Tasks',
  //   color: 'hsl(var(--chart-2))',
  // },
} satisfies ChartConfig;

export function TaskActivity({ data }: { data: ITaskLog[] }) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('duration');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
    });

    observer.observe(containerRef.current);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, []);
  const total = useMemo(
    () => ({
      duration: data.reduce((acc, curr) => acc + curr.duration, 0),
    }),
    [data],
  );

  return (
    <div className="h-auto">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Task Activity Overview</CardTitle>
          <CardDescription>Tracking tasks completed over the last 2 weeks</CardDescription>
        </div>
        <div className="flex">
          {['duration'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              // eslint-disable-next-line react/button-has-type
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {timeFormat(total[key as keyof typeof total])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6" ref={containerRef}>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="duration"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  day: 'numeric',
                  weekday: 'long',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="loggedAt"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
