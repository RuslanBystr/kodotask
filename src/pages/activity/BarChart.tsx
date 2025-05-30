'use client';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/types';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useGetUserActivityQuery } from '@/services/users';
import { selectAuthenticatedUserSelector } from '@/store';
import { timeFormat } from '@/utils/time-format';

const chartConfig = {
  totalTime: {
    label: 'Total Time',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ActivityChart({
  setSelectedDate,
  className,
}: {
  setSelectedDate: Dispatch<SetStateAction<string | null>>;
  className: string;
}) {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id ?? undefined;

  const { data } = useGetUserActivityQuery({ userId });
  const scrolledBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrolledBlockRef.current?.scroll({
      top: 0,
      left: scrolledBlockRef.current?.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  const formattedData =
    data
      ?.filter((entry) => entry.date)
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalTime: Number(entry.totaltime) || 0,
      })) || [];

  const handleBarClick = (activeCol: CategoricalChartState) => {
    if (activeCol?.activeLabel) {
      setSelectedDate(activeCol.activeLabel);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Logged time per day</CardDescription>
      </CardHeader>

      <CardContent className="w-full overflow-x-auto">
        <div className="flex">
          <div className="sticky left-0 z-10 border-r">
            <BarChart width={70} height={300} data={formattedData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
              <YAxis
                tick={{ fill: 'var(--color-chart-1)', fontSize: 14 }}
                tickMargin={5}
                axisLine={false}
                tickFormatter={(value) => timeFormat(value)}
              />
              <Bar className="hidden" dataKey="totalTime" fill="red" />
            </BarChart>
          </div>

          <div ref={scrolledBlockRef} className="overflow-x-auto custom-scrollbar">
            <ChartContainer className="h-[40vh] min-w-[700px]" config={chartConfig}>
              <BarChart
                data={formattedData}
                width={Math.max(formattedData.length * 40, 700)}
                height={300}
                onClick={handleBarClick}
              >
                <CartesianGrid vertical={false} strokeDasharray="10 10" />
                <XAxis dataKey="date" tickLine={false} tickMargin={5} axisLine={false} />
                <Tooltip
                  content={
                    <ChartTooltipContent className="rounded-none cut cut-left-5 cut-right-5 bg-[#1F2A30] border-none" />
                  }
                />
                <Bar
                  dataKey="totalTime"
                  fill="var(--color-chart-1)"
                  radius={4}
                  activeBar={{
                    fill: 'var(--color-chart-1)',
                    stroke: 'var(--color-chart-1)',
                    strokeWidth: 2,
                  }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Showing logged time per day</div>
      </CardFooter>
    </Card>
  );
}
