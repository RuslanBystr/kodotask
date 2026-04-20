import { clsx } from 'clsx';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export interface ChatItemUIProps {
  title: string;
  preview: string;
  time: string;
  avatar?: string | undefined;
  isOnline?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

export const ChatItem = ({ title, preview, time, avatar, isOnline, isActive, onClick }: ChatItemUIProps) => (
  <SidebarMenuButton
    className={clsx(
      'h-12 rounded-none border-b transition-all active:scale-95 shadow-md cut cut-right-5 cut-left-5',
      'bg-[#4a6070]/10 hover:bg-[#4a6070]',
      { 'bg-[#557080]': isActive },
    )}
    onClick={onClick}
  >
    <div className="relative mr-2 shrink-0">
      {isOnline && (
        <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white/20 bg-green-500 z-10" />
      )}
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={avatar} alt={title} />
        <AvatarFallback>{title?.[0]?.toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
    </div>

    <div className="min-w-0 flex-1 hidden md:block">
      <div className="flex justify-between">
        <p className="truncate font-medium">{title}</p>
        <p className="text-[10px] opacity-70">{time}</p>
      </div>
      <p className="truncate text-sm opacity-80">{preview}</p>
    </div>
  </SidebarMenuButton>
);
