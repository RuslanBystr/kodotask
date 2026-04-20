'use client';

import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ActivityChart } from '@/pages/activity/BarChart';
import { useGetUserActivityQuery } from '@/services/users';
import { selectAuthenticatedUserSelector } from '@/store';

const formatDate = (ms: string | null) =>
  ms
    ? new Intl.DateTimeFormat('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(Number(ms)))
    : '';

export const ActivityPage: React.FC = () => {
  const { isMobile } = useSidebar();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const userId = useSelector(selectAuthenticatedUserSelector)?.id ?? null;

  const { data: activityData, isLoading } = useGetUserActivityQuery({ userId });

  const filteredLogs = useMemo(
    () => (activityData ?? []).filter((a) => !selectedDate || a.date === selectedDate),
    [activityData, selectedDate],
  );

  return (
    <div className="p-2 flex flex-col h-[calc(100vh-64px)]">
      <header className="flex h-16 shrink-0 items-center gap-3 px-4">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block text-xl">
                <BreadcrumbLink href="">Activity</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="text-sm text-muted-foreground">Overview of time and logs by day</div>
        </div>
      </header>

      <div className="flex-1 flex flex-row gap-4 p-4 overflow-hidden">
        {/* Chart block */}
        <div className="flex-1 flex flex-col bg-transparent rounded-none p-4 shadow-sm">
          <ActivityChart setSelectedDate={setSelectedDate} data={activityData ?? []} />

          {/* Date select */}
          <div className="mt-3 flex items-center gap-2">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="text-sm font-medium">Select date:</label>
            <select
              className="border bg-accent outline-none cursor-pointer rounded px-2 py-1 text-sm"
              value={selectedDate ?? ''}
              onChange={(e) => setSelectedDate(e.target.value || null)}
            >
              <option value="">All dates</option>
              {(activityData ?? [])
                .filter((a) => a.date)
                .map((a) => (
                  <option key={a.date} value={a.date}>
                    {new Intl.DateTimeFormat('uk-UA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
                      new Date(Number(a.date)),
                    )}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="md:w-[30%] overflow-auto bg-transparent rounded-none border-l shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-2">Logs {selectedDate ? `— ${formatDate(selectedDate)}` : ''}</h3>

          {filteredLogs.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">No logs</div>
          )}

          {filteredLogs.map((log) => (
            <div
              key={log.date}
              className="flex w-full gap-4 py-3 px-3 hover:bg-slate-50 rounded-none cursor-pointer border-b last:border-b-0 items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{formatDate(log.date)}</div>
                <div className="text-xs text-muted-foreground mt-1">Time: {Math.round(Number(log.totalTime))} min</div>
              </div>
              <div className="ml-4 text-xs text-muted-foreground">
                {new Date(Number(log.date)).toLocaleDateString('uk-UA')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
