'use client';

import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useGetUserActivityQuery } from '@/services/users';
import { selectAuthenticatedUserSelector } from '@/store';
import { timeFormat } from '@/utils/time-format';

const chartConfig = {
  totaltime: {
    label: 'Total Time',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ActivityChart() {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id ?? undefined;

  const { data } = useGetUserActivityQuery({ userId });

  const formattedData =
    data
      ?.filter((entry) => entry.date)
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totaltime: Number(entry.totaltime) || 0,
      })) || [];

  return (
    <Card className="bg-transparent flex flex-col items-center rounded-none border-none">
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
              <Bar className="hidden" dataKey="totaltime" fill="red" />
            </BarChart>
          </div>

          <div className="overflow-x-auto">
            <ChartContainer className="h-[30vh] min-w-[700px]" config={chartConfig}>
              <BarChart data={formattedData} width={Math.max(formattedData.length * 40, 700)} height={300}>
                <CartesianGrid vertical={false} strokeDasharray="10 10" />
                <XAxis dataKey="date" tickLine={false} tickMargin={5} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totaltime" fill="var(--color-chart-1)" radius={4} />
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
