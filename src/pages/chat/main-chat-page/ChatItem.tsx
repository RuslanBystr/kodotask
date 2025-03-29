import { clsx } from 'clsx';

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
export const ChatItem = ({ chat, onlineUsers, userId, handleSelectedChat, activeChat }: ChatItemProps) => {
  const lastMessage = chat?.lastMessage;
  const formattedDate = lastMessage?.createdAt
    ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const receiver = chat?.userChats?.find((userChat) => Number(userChat.user.id) === userId);
  const sender = chat?.userChats?.find((userChat) => Number(userChat.user.id) !== userId);
  const isOnline = onlineUsers.includes(sender?.user?.id || '');

  const chatName = chat?.groupName || receiver?.name || '';

  const getMessageContent = (message: IMessageResponse) => {
    if (message?.content) {
      return message.content.length > 18 ? `${message.content.slice(0, 18)}...` : message.content;
    }
    if (message?.file) {
      return 'Image Message';
    }
    return 'Voice Message';
  };

  return (
    <SidebarMenuButton
      key={chat.id}
      className={clsx(
        'h-[3em] bg-[#4a6070]/10 hover:bg-[#4a6070] rounded-none border-b transition-all active:scale-95 active:bg-[#557080] shadow-md cut cut-right-5 cut-left-5',
        {
          'bg-[#557080]': activeChat?.id === chat.id,
        },
      )}
      onClick={() => handleSelectedChat(chat)}
    >
      <div className="relative">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={receiver?.avatar ? `${api}/file/${sender?.user.avatar}` : ''} alt="file" />
          <AvatarFallback>{chatName?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {chat?.messages?.length > 0 && (
          <div className="absolute sm:-left-1 md:right-0 bottom-0 bg-[#559965] w-4 h-4 rounded-full border border-green-200 text-[10px] flex justify-center items-center">
            {chat?.messages?.length > 99 ? '99' : chat?.messages?.length}
          </div>
        )}
        {isOnline && (
          <span
            className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border border-green-200"
            title="Online"
          />
        )}
      </div>

      <div className="relative hidden md:block w-full">
        <div className="flex justify-between w-full">
          <p>{chatName}</p>
          <p className="text-[10px]">{formattedDate}</p>
        </div>
        <p className="text-accent h-6">{getMessageContent(lastMessage)}</p>
      </div>
    </SidebarMenuButton>
  );
};
