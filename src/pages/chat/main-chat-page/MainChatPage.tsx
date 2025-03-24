import { clsx } from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { useFilterChats } from '@/pages/chat/hooks/useFilterChats';
import { useUserConnection } from '@/pages/chat/hooks/useUserConnection';
import { PrivateChat } from '@/pages/chat/private-chat/PrivateChat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IChatResponse, IUserChat } from '@/types/responses/IChatResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { getEnv } from '@/utils';

import { useMainChatsPage } from './useMainChatsPage';

const { api } = getEnv();

const MainChatPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;

  const [activeChat, setActiveChat] = useState<IChatResponse | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<IUserChat | undefined>(undefined);

  const [userStatus, setUserStatus] = useState<string>('');
  const { chats } = useMainChatsPage();

  const onlineUsers = useUserConnection({ userId });

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      setActiveChat(chat);
      navigate(`/chats/user/${chat.id}`);
    },
    [navigate],
  );

  const { filterValue, filteredChats } = useFilterChats(chats?.items);

  useEffect(() => {
    if (activeChat) {
      const companion = activeChat.userChats?.find((userChat) => Number(userChat.user.id) !== userId);
      setSelectedCompanion(companion);
    }
  }, [activeChat, userId]);

  return (
    <div className="flex">
      <div className="flex flex-col h-[100vh] w-min-content border-r">
        <header className="flex min-h-[72px] shrink-0 justify-center md:justify-start items-center border-b">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-4 h-4 hidden md:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="">Chats</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center gap-1 w-14 md:w-[14em] flex-col px-1 pt-2 md:p-2 bg-muted/10">
          <Input className="md:w-[14em] p-2 text-[10px]" placeholder="Search" onChange={filterValue} />

          {!filteredChats ? (
            <div className="w-full h-full flex justify-center">
              <Loading size={32} />
            </div>
          ) : (
            filteredChats.map((chat) => {
              const lastMessage = chat?.lastMessage;
              const formattedDate = lastMessage?.createdAt
                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              const receiver = chat?.userChats?.find((userChat) => Number(userChat.user.id) === userId);
              const sender = chat?.userChats?.find((userChat) => Number(userChat.user.id) !== userId);

              const chatName = chat?.groupName || receiver?.name || '';
              const isOnline = onlineUsers.includes(sender?.user?.id || '');

              return (
                <SidebarMenuButton
                  key={chat.id}
                  className={clsx(
                    'h-[3em] hover:bg-[#557080] rounded-none border-b transition-all active:scale-95 active:bg-[#557080] shadow-md cut cut-right-5 cut-left-5',
                    {
                      'bg-[#557080]': activeChat?.id === chat.id,
                    },
                  )}
                  onClick={() => handleSelectedChat(chat)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-full relative">
                      <AvatarImage src={receiver?.avatar ? `${api}/file/${sender?.user.avatar}` : ''} alt="file" />
                      <AvatarFallback>{chatName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span
                        className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border border-green-200"
                        title="Online"
                      />
                    )}
                  </div>

                  <div className="relative hidden md:block w-full">
                    {chat?.messages?.length > 0 && (
                      <div className="absolute right-0 bottom-1 bg-[#7799aa] min-w-6 cut text-center">
                        {chat?.messages?.length}
                      </div>
                    )}
                    <div className="flex justify-between w-full">
                      <p>{chatName}</p>
                      <p className="text-[10px]">{formattedDate}</p>
                    </div>
                    <p className="text-accent h-6">
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {lastMessage?.content === null
                        ? 'Voice Message'
                        : lastMessage?.content?.length > 15
                          ? `${lastMessage.content.slice(0, 18)}...`
                          : lastMessage?.content}
                    </p>
                  </div>
                </SidebarMenuButton>
              );
            })
          )}
        </div>
      </div>

      <div
        className="flex flex-col w-full relative"
        style={{
          backgroundImage: selectedCompanion ? `url(${api}/file/${selectedCompanion.user.avatar})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center w-full min-h-[72px] pl-6 border-b bg-[#374C53]/90">
          <Avatar className="h-12 w-12 mr-2">
            {selectedCompanion && (
              <AvatarImage src={`${api}/file/${selectedCompanion.user.avatar}`} alt={userData?.firstName} />
            )}
            <AvatarFallback className="h-12 w-12 rounded-full relative">NM</AvatarFallback>
          </Avatar>
          <div>
            <p>{selectedCompanion && selectedCompanion.user.firstName}</p>
            <p className="text-[12px]">
              {activeChat &&
                selectedCompanion &&
                (onlineUsers.includes(selectedCompanion.user.id) ? (
                  <p className="text-green-400">{userStatus === 'typing' ? 'Typing...' : 'Online'}</p>
                ) : (
                  'Offline'
                ))}
            </p>
          </div>
        </div>
        <PrivateChat changeStatus={setUserStatus} />
      </div>
    </div>
  );
};

export default MainChatPage;
