import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function DeleteTaskDialog({ taskId }: { taskId: string }) {
  const navigate = useNavigate();
  const [deleteTask] = useDeleteTaskMutation();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    deleteTask(taskId).then(() => {
      navigate(`/tasks`);
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-none bg-transparent hover:bg-[#88aabb] cut-bottom-left-5"
          onClick={() => setOpen(true)}
        >
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
