import { MessageSquarePlus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/utils';

export function RightSidebar({
  title = '',
  trigger,
  className,
  children,
}: {
  title?: string;
  trigger?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  if (isMobile) {
    // Mobile: slide-in sheet from the RIGHT
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {trigger ?? (
            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] max-w-[420px] p-0 bg-muted">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-base">{title}</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-3.25rem)] overflow-auto">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: static right column
  return (
    <aside
      className={cn(
        'hidden md:block w-[360px] shrink-0 border-l bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/50',
        className,
      )}
    >
      <div className="h-[calc(100vh-4rem)] overflow-auto">{children}</div>
    </aside>
  );
}
