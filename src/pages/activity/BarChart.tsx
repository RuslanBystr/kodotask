import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/types';

import { IActivityResponse } from '@/types/responses/IActivityResponse';

export function ActivityChart({
  data,
  setSelectedDate,
}: {
  data: IActivityResponse[];
  setSelectedDate: Dispatch<SetStateAction<string | null>>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const formattedData = data.map((d) => ({
    date: new Date(Number(d.date)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    totalTime: Number(d.totalTime),
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => setContainerWidth(containerRef.current?.offsetWidth ?? 0);

    updateWidth();
    window.addEventListener('resize', updateWidth);

    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const barSize = 30;
  const chartWidth = Math.max(formattedData.length * (barSize + 8), containerWidth);

  const handleBarClick = (e: CategoricalChartState) => {
    if (e?.activeLabel) setSelectedDate(e.activeLabel);
  };

  return (
    <div ref={containerRef} className="w-full h-[300px] overflow-x-auto">
      <BarChart data={formattedData} width={chartWidth} height={300} onClick={handleBarClick}>
        <CartesianGrid vertical={false} stroke="#556" strokeDasharray="5 7" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(v) => v} />
        <Tooltip />
        <Bar dataKey="totalTime" fill="var(--color-chart-1)" barSize={barSize} />
      </BarChart>
    </div>
  );
}
