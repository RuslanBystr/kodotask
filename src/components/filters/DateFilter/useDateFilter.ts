import { useEffect, useState } from 'react';

import { usePopup } from '@/hooks';
import { getNextDate, getPreviousDate } from '@/utils';

import { IDateFilterProps } from './types';

export const useDateFilter = ({ filter, onChange }: IDateFilterProps) => {
  const [date, setDate] = useState<Date | null>(new Date());

  const { anchorEl, isOpened, handlePopoverOpen, handlePopoverClose } = usePopup();

  const currentDayHandler = () => {
    setDate(new Date());
    handlePopoverClose();
  };

  const getPreviousDateHandler =
    (newDate = new Date()) =>
    () => {
      setDate(getPreviousDate(newDate));
    };

  const getNextDateHandler = () => {
    setDate(getNextDate(date as Date));
  };

  const changeDateHandler = (newDate: Date | null) => {
    setDate(newDate);
  };

  useEffect(() => {
    if (date) {
      onChange(filter.name, date);
    }
  }, [date, filter.name, onChange]);

  return {
    date,
    anchorEl,
    isOpened,
    handlePopoverOpen,
    handlePopoverClose,
    currentDayHandler,
    getPreviousDateHandler,
    changeDateHandler,
    getNextDateHandler,
  };
};
