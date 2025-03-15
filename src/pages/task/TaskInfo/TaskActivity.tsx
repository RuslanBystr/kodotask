'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: '2024-04-01', review: 12, development: 30 },
  { date: '2024-04-02', review: 15, development: 25 },
  { date: '2024-04-03', review: 10, development: 40 },
  { date: '2024-04-04', review: 20, development: 35 },
  { date: '2024-04-05', review: 18, development: 28 },
  { date: '2024-04-06', review: 25, development: 50 },
  { date: '2024-04-07', review: 30, development: 45 },
  { date: '2024-04-08', review: 22, development: 38 },
  { date: '2024-04-09', review: 17, development: 33 },
  { date: '2024-04-10', review: 19, development: 42 },
  { date: '2024-04-11', review: 27, development: 39 },
  { date: '2024-04-12', review: 14, development: 31 },
  { date: '2024-04-13', review: 21, development: 37 },
  { date: '2024-04-14', review: 29, development: 48 },
];

const chartConfig = {
  review: {
    label: 'Code Reviews',
    color: 'hsl(var(--chart-1))',
  },
  development: {
    label: 'Development Tasks',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function TaskActivity() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('development');

  const total = React.useMemo(
    () => ({
      review: chartData.reduce((acc, curr) => acc + curr.review, 0),
      development: chartData.reduce((acc, curr) => acc + curr.development, 0),
    }),
    [],
  );

  return (
    <div>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Task Activity Overview</CardTitle>
          <CardDescription>Tracking tasks completed over the last 2 weeks</CardDescription>
        </div>
        <div className="flex">
          {['review', 'development'].map((key) => {
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
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
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
                  nameKey="tasks"
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
