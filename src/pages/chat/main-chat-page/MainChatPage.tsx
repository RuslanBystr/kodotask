import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CallModal } from '@/components/modals/call-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Chat } from '@/pages/chat/common/Chat';
import VideoChat from '@/pages/chat/common/VideoChat';
import { useFilterChats } from '@/pages/chat/hooks/useFilterChats';
import { useUserConnection } from '@/pages/chat/hooks/useUserConnection';
import { ChatItem } from '@/pages/chat/main-chat-page/ChatItem';
import { useDeletePrivateChatMutation } from '@/services/chat';
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

  const { chats, refetch } = useMainChatsPage();
  const onlineUsers = useUserConnection({ userId });
  const { filterValue, filteredChats } = useFilterChats(chats?.items);

  const [activeChat, setActiveChat] = useState<IChatResponse | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<IUserChat | undefined>(undefined);
  const [deleteChat] = useDeletePrivateChatMutation();

  useEffect(() => {
    if (!activeChat) return;
    const companion = activeChat.userChats?.find((userChat) => Number(userChat.user.id) !== userId);
    setSelectedCompanion(companion);
  }, [activeChat, userId]);

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      setActiveChat(chat);
      navigate(`/chats/user/${chat.id}`);
    },
    [navigate],
  );

  const handleDeleteChat = async (chat: IChatResponse) => {
    try {
      setActiveChat(null);
      await deleteChat({ chatId: chat.id });
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const renderChatList = () => {
    if (!filteredChats) {
      return (
        <div className="w-full h-full flex justify-center">
          <Loading size={32} />
        </div>
      );
    }
    return filteredChats.map((chat) => (
      <ContextMenu key={`chat-button-${chat.id}`}>
        <ContextMenuTrigger className="w-full">
          <ChatItem
            chat={chat}
            userId={userId}
            activeChat={activeChat}
            onlineUsers={onlineUsers}
            handleSelectedChat={handleSelectedChat}
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-card rounded-none border-none cut cut-left-5 cut-right-5">
          <ContextMenuItem onClick={() => handleDeleteChat(chat)}>Delete chat</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ));
  };

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
          <Input className="md:w-full p-2 text-[10px]" placeholder="Search" onChange={filterValue} />
          {renderChatList()}
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
        <div className="flex flex-col w-full">
          <div className="flex h-[72px] border-b bg-[#374C53]/90 items-center justify-between gap-2 px-2">
            <div className="flex">
              {selectedCompanion && (
                <Avatar className="h-12 w-12 mr-2">
                  <AvatarImage
                    src={`${api}/file/${selectedCompanion.user.avatar}`}
                    alt={selectedCompanion?.user.firstName}
                    height={48}
                    width={48}
                  />
                  <AvatarFallback className="h-12 w-12 rounded-full relative">NM</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p>{selectedCompanion?.user.firstName}</p>
                <p className="text-[12px]">
                  {selectedCompanion &&
                    (onlineUsers.includes(selectedCompanion.user.id) ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      'Offline'
                    ))}
                </p>
              </div>
            </div>
            {selectedCompanion && (
              <CallModal>
                {activeChat && <VideoChat receiverId={selectedCompanion?.user.id} chatId={activeChat?.id.toString()} />}
              </CallModal>
            )}
          </div>
          <Chat refetchChats={refetch} />
        </div>
      </div>
    </div>
  );
};

export default MainChatPage;
