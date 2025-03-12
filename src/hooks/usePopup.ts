import type { MouseEvent } from 'react';
import { useState } from 'react';

const usePopup = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isOpened = !!anchorEl;

  return {
    setAnchorEl,
    anchorEl,
    handlePopoverOpen,
    isOpened,
    handlePopoverClose,
  };
};

export default usePopup;
