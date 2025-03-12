import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog';

import type { IDeleteConfirmationDialogProps } from './types';
import useDeleteConfirmationDialog from './useDeleteConfirmationDialog';

const DeleteConfirmationDialog: React.FC<IDeleteConfirmationDialogProps> = ({
  open,
  text,
  onClose,
  onConfirm,
  ...props
}) => {
  const { isLoading, handleConfirm } = useDeleteConfirmationDialog(onConfirm);
  return (
    <Dialog open={open} {...props}>
      <DialogTitle>{text}</DialogTitle>
      <DialogDescription>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleConfirm} autoFocus variant="default" color="error" disabled={isLoading}>
          Confirm
        </Button>
      </DialogDescription>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
