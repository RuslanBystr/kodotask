import { Trash } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDeleteTaskMutation } from '@/services/task';

export function DeleteTaskDialog({ userId }: { userId: string }) {
  const [deleteTask] = useDeleteTaskMutation();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    deleteTask(userId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
          <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outline" type="submit" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
