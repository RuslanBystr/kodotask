import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { VideoIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ChatTypeEnum } from '@/enums/chat-type.enum';
import { useFilterChats } from '@/hooks/chat/useFilterChats';
import { useMainChatsPage } from '@/hooks/chat/useMainChatsPage';
import { mapChatToChatItemProps } from '@/pages/chat/chat-item.mapper';
import { Chat } from '@/pages/chat/common/Chat';
import { ChatItem } from '@/pages/chat/private-chat/ChatItem';
import { ChatList } from '@/pages/chat/sidebar/chat-list';
import { ChatSidebarControls } from '@/pages/chat/sidebar/chat-sidebar-controls';
import { SidebarChatLayout } from '@/pages/chat/sidebar/sidebar-chat-layout';
import { useDeletePrivateChatMutation } from '@/services/chat';
import { selectAuthenticatedUserSelector, useAppSelector } from '@/store';
import { openCall } from '@/store/call';
import { selectOnlineUsers } from '@/store/users/selectors';
import { IChatResponse, IUserChat } from '@/types/responses/IChatResponse';
import { getEnv } from '@/utils';
import { socket } from '@/utils/socket';

const { api } = getEnv();

const MainChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const { id: routeChatId } = useParams<{ id: string }>();

  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;

  const { chats, refetch } = useMainChatsPage({ chatTypeQuery: ChatTypeEnum.PRIVATE });

  const onlineUsers = useAppSelector(selectOnlineUsers);

  const { filterValue, filteredChats } = useFilterChats(chats?.items);

  const activeChat = useMemo(() => {
    if (!chats?.items || !routeChatId) return null;

    return chats.items.find((chat: IChatResponse) => String(chat.id) === String(routeChatId)) ?? null;
  }, [chats?.items, routeChatId]);

  const selectedCompanion = useMemo(() => {
    if (!activeChat || !userId) return undefined;

    return activeChat.userChats?.find((userChat: IUserChat) => String(userChat.user.id) !== String(userId));
  }, [activeChat, userId]);

  useEffect(() => {
    if (!routeChatId) return;

    const chatId = String(routeChatId);

    socket.emit('joinChat', chatId);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.emit('leaveChat', chatId);
    };
  }, [routeChatId]);

  const [deleteChat] = useDeletePrivateChatMutation();

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      navigate(`/chats/user/${chat.id}`);
    },
    [navigate],
  );

  if (!userId) return null;

  const handleDeleteChat = async (chat: IChatResponse) => {
    try {
      await deleteChat({ chatId: chat.id }).unwrap();

      if (String(chat.id) === String(routeChatId)) {
        navigate('/chats/user');
      }
    } catch (e) {
      toast.error('Failed to delete chat');
    }
  };

  const handleStartVideoCall = () => {
    if (!selectedCompanion || !routeChatId) return;

    dispatch(
      openCall({
        receiverId: String(selectedCompanion.user.id),
        chatId: String(routeChatId),
      }),
    );
  };

  return (
    <div className="md:pl-2 flex">
      {/* SIDEBAR */}
      <SidebarChatLayout
        header={
          <header className="flex items-center justify-center md:justify-start">
            {isMobile && <SidebarTrigger className="-ml-1" />}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block md:text-lg">
                  <BreadcrumbLink href="">Chats</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
        }
        list={
          <>
            <ChatSidebarControls onSearch={filterValue} />
            <ChatList
              items={filteredChats ?? []}
              isLoading={!filteredChats}
              renderItem={(chat) => {
                const props = mapChatToChatItemProps(chat, userId?.toString(), activeChat, onlineUsers);

                return (
                  <ContextMenu key={chat.id}>
                    <ContextMenuTrigger asChild>
                      <div>
                        <ChatItem {...props} onClick={() => handleSelectedChat(chat)} />
                      </div>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => handleDeleteChat(chat)}>Delete chat</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              }}
            />
          </>
        }
      />

      {/* MAIN CHAT */}
      <div className="flex flex-col w-full relative">
        <div className="flex flex-col w-full h-full">
          <div className="flex h-full bg-transparent items-center justify-between gap-2 px-2">
            <div className="flex justify-center items-center gap-2 my-2">
              {selectedCompanion && (
                <Avatar className="h-12 w-12 mr-2">
                  <AvatarImage
                    src={`${api}/file/${selectedCompanion.user.avatar}`}
                    alt={selectedCompanion?.user?.firstName}
                    height={48}
                    width={48}
                  />
                  <AvatarFallback>NM</AvatarFallback>
                </Avatar>
              )}

              {selectedCompanion && (
                <div className="">
                  <p>{selectedCompanion.user.firstName}</p>
                  <p className="text-[12px]">
                    {onlineUsers.includes(String(selectedCompanion.user.id)) ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              )}
            </div>

            {selectedCompanion && routeChatId && (
              <Button className="rounded-none bg-[--main-button] active:scale-95" onClick={handleStartVideoCall}>
                <VideoIcon className="mr-2 h-4 w-4" />
                Call
              </Button>
            )}
          </div>

          <Chat refetchChats={refetch} />
        </div>
      </div>
    </div>
  );
};

export default MainChatPage;
