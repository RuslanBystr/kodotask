import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { dateOptions } from './constants';
import { IDateFilterProps } from './types';
import { useDateFilter } from './useDateFilter';

const DateFilter: React.FC<IDateFilterProps> = ({ filter, onChange }) => {
  const { date, isOpened, getPreviousDateHandler, getNextDateHandler, currentDayHandler } = useDateFilter({
    filter,
    onChange,
  });

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" onClick={getPreviousDateHandler(date as Date)} size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Popover open={isOpened}>
        <PopoverTrigger asChild>
          <Button variant="ghost" aria-label="open calendar">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="ml-2">{date?.toLocaleDateString(undefined, dateOptions)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <Card className="p-4">
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={currentDayHandler}>
                Today
              </Button>
              <Button variant="outline" onClick={getPreviousDateHandler()} className="ml-2">
                Yesterday
              </Button>
            </div>
          </Card>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" onClick={() => getNextDateHandler()} size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateFilter;
