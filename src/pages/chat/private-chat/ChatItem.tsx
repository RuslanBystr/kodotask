import { clsx } from 'clsx';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { IChatResponse } from '@/types/responses/IChatResponse';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

interface ChatItemProps {
  chat: IChatResponse;
  onlineUsers: string[];
  userId: number | undefined;
  handleSelectedChat: (chat: IChatResponse) => void;
  activeChat: IChatResponse | null;
}

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trim()}…` : s);

const getMessagePreview = (message?: IMessageResponse) => {
  if (!message) return 'No messages yet';

  if (message.content && message.content.trim().length) {
    return truncate(message.content.trim(), 36);
  }

  const { file } = message;

  // if (mime?.startsWith?.('image/')) return 'Photo';
  // if (mime?.startsWith?.('audio/')) return 'Voice message';
  // if (mime?.startsWith?.('video/')) return 'Video';

  if (file) return 'Attachment';

  return 'Voice message';
};

export const ChatItem = ({ chat, onlineUsers, userId, handleSelectedChat, activeChat }: ChatItemProps) => {
  const myId = String(userId ?? '');

  const companion = useMemo(() => chat?.userChats?.find((uc) => String(uc.user.id) !== myId), [chat?.userChats, myId]);

  const lastMessage = chat?.lastMessage;

  const formattedTime = useMemo(() => {
    if (!lastMessage?.createdAt) return '';
    try {
      return new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }, [lastMessage?.createdAt]);

  const chatName = useMemo(() => {
    if (chat?.groupName) return chat.groupName;
    const u = companion?.user;
    if (!u) return 'Chat';
    const full = [u.firstName].filter(Boolean).join(' ').trim();
    return full || u.firstName || `User #${u.id}`;
  }, [chat?.groupName, companion?.user]);

  const avatarUrl = useMemo(() => {
    const u = companion?.user;
    return u?.avatar ? `${api}/file/${u.avatar}` : undefined;
  }, [companion?.user]);

  const isOnline = useMemo(() => {
    const id = companion?.user?.id;
    return id ? onlineUsers.includes(String(id)) : false;
  }, [onlineUsers, companion?.user?.id]);

  return (
    <SidebarMenuButton
      className={clsx(
        'h-[3em] rounded-none border-b transition-all active:scale-95 shadow-md cut cut-right-5 cut-left-5',
        'bg-[#4a6070]/10 hover:bg-[#4a6070]',
        { 'bg-[#557080]': activeChat?.id === chat.id },
      )}
      onClick={() => handleSelectedChat(chat)}
      aria-label={`Open chat with ${chatName}`}
      title={chatName}
    >
      <div className="relative mr-2 shrink-0">
        <div className="">
          {isOnline && (
            <span
              className="absolute z-20 right-0 bottom-0 h-3 w-3 rounded-full border border-white/20 bg-green-500"
              title="Online"
            />
          )}
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={avatarUrl} alt={chatName} />
            <AvatarFallback>{chatName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="min-w-0 flex-1 hidden md:block">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium">{chatName}</p>
          <p className="shrink-0 text-[10px] opacity-70">{formattedTime}</p>
        </div>
        <p className="truncate text-sm opacity-80">{getMessagePreview(lastMessage)}</p>
      </div>
    </SidebarMenuButton>
  );
};
