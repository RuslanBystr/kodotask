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
import { useDeleteUserMutation } from '@/services/users';

export function DeleteUserDialog({ userId }: { userId: number }) {
  const [deleteUser] = useDeleteUserMutation();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    deleteUser(userId);
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
          <DialogTitle>Delete email</DialogTitle>
          <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
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
