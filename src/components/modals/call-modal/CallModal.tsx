import { PhoneCall } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CallModal({
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
          <PhoneCall />
          Call
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full min-h-[200px] bg-[#374C53] rounded-none">
        <DialogHeader>
          <DialogTitle>Call with Member</DialogTitle>
          <DialogDescription>Call if your companion in the network</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
