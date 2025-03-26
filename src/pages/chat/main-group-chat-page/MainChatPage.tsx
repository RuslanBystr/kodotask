import { clsx } from 'clsx';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { GroupChat } from '@/pages/chat/group-chat/GroupChat';
import { useFilterChats } from '@/pages/chat/hooks/useFilterChats';
import { selectAuthenticatedUserSelector } from '@/store';
import { IChatResponse } from '@/types/responses/IChatResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { getEnv } from '@/utils';

import { useMainChatsPage } from './useMainChatsPage';

const { api } = getEnv();

const MainGroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;
  const [activeChat, setActiveChat] = useState<IChatResponse | null>(null);
  const [userStatus, setUserStatus] = useState<string>('');

  const { chats, refetch } = useMainChatsPage();

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      setActiveChat(chat);
      navigate(`/groups/${chat.id}`);
    },
    [navigate],
  );

  const { filterValue, filteredChats } = useFilterChats(chats?.items);

  return (
    <div className="md:p-2 flex">
      <div className="flex flex-col h-[100vh] w-min-content border-r">
        <header className="flex h-16 shrink-0 justify-center md:justify-start items-center border-b">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-4 h-4 hidden md:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="">Group Chats</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center gap-1 w-14 md:w-[14em] flex-col px-1 pt-2 md:p-2 bg-muted/10">
          <div className="md:flex md:flex-row-reverse w-full">
            <Button className=" bg-[#345a66] hover:bg-[#446976] border">
              <PlusIcon />
            </Button>
            <Input className="p-2 text-[10px]" placeholder="Search" onChange={filterValue} />
          </div>

          {!filteredChats ? (
            <div className="w-full h-full flex justify-center">
              <Loading size={32} />
            </div>
          ) : (
            filteredChats?.map((chat) => {
              const lastMessage = chat?.lastMessage;
              const formattedDate = lastMessage?.createdAt
                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              const receiver = chat?.userChats?.filter((userChat) => Number(userChat?.user?.id) === userId)[0];
              const sender = chat?.userChats?.filter((userChat) => Number(userChat?.user?.id) !== userId)[0];

              const chatName = chat?.groupName || receiver?.name || '';

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
                      <AvatarImage src={receiver?.avatar ? `${api}/file/${sender.user.avatar}` : ''} alt="file" />
                      <AvatarFallback>{chatName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="hidden md:block w-full">
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

      <div className="flex flex-col w-full">
        <div className="flex items-center w-full min-h-16 pl-6 border-b">
          <p>{activeChat && activeChat.groupName}</p>
          <p className="text-[12px]">
            {activeChat && <p className="text-green-400">{userStatus === 'typing' ? 'Typing...' : ''}</p>}
          </p>
        </div>
        <GroupChat changeStatus={setUserStatus} refetchChats={refetch} />
      </div>
    </div>
  );
};

export default MainGroupChatPage;
