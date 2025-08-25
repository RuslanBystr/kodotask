import { PlusIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CreateGroupModal({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-none bg-[--main-button] transition-all active:scale-90 hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
          onClick={() => setOpen(true)}
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full min-h-[200px] bg-[#3F5362] rounded-none">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
