import { useState } from 'react';

import type { IDeleteConfirmationDialogProps } from '.';

const useDeleteConfirmationDialog = (onConfirm: IDeleteConfirmationDialogProps['onConfirm']) => {
  const [isLoading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const promiseMaybe = onConfirm();
    if (typeof (promiseMaybe as Promise<unknown>)?.then === 'function') {
      setLoading(true);
      await promiseMaybe;
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleConfirm,
  };
};

export default useDeleteConfirmationDialog;
