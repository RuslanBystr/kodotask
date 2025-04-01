'use client';

import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useGetUserActivityQuery } from '@/services/users';
import { selectAuthenticatedUserSelector } from '@/store';

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
      <CardContent>
        <ChartContainer className="flex justify-center h-[30vh]" config={chartConfig}>
          <BarChart data={formattedData} width={600} height={300}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickMargin={10} axisLine={false} tickFormatter={(value) => `${value} min`} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="totaltime" fill="var(--color-chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Showing logged time per day</div>
        {/* <div className="leading-none text-muted-foreground">Showing logged time per day</div> */}
      </CardFooter>
    </Card>
  );
}
