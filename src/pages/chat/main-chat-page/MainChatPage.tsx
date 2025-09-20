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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ChatTypeEnum } from '@/enums/chat-type.enum';
import { Chat } from '@/pages/chat/common/Chat';
import { useFilterChats } from '@/pages/chat/hooks/useFilterChats';
import { useMainChatsPage } from '@/pages/chat/hooks/useMainChatsPage';
import { ChatItem } from '@/pages/chat/main-chat-page/ChatItem';
import { useDeletePrivateChatMutation } from '@/services/chat';
import { selectAuthenticatedUserSelector, useAppSelector } from '@/store';
import { openCall } from '@/store/call';
import { selectOnlineUsers } from '@/store/users/selectors';
import { IChatResponse, IUserChat } from '@/types/responses/IChatResponse';
import { Loading } from '@/ui-kit/loading/Loading';
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

  const activeChat: IChatResponse | null = useMemo(() => {
    if (!filteredChats || !routeChatId) return null;
    return filteredChats.find((c) => String(c.id) === String(routeChatId)) ?? null;
  }, [filteredChats, routeChatId]);

  const selectedCompanion: IUserChat | undefined = useMemo(() => {
    if (!activeChat || !userId) return undefined;
    const myId = String(userId);
    return activeChat.userChats?.find((uc) => String(uc.user.id) !== myId);
  }, [activeChat, userId]);

  useEffect(() => {
    if (!routeChatId) return;
    socket.emit('joinChat', String(routeChatId));
  }, [routeChatId]);

  const [deleteChat] = useDeletePrivateChatMutation();

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      navigate(`/chats/user/${chat.id}`);
    },
    [navigate],
  );

  const handleDeleteChat = async (chat: IChatResponse) => {
    try {
      await deleteChat({ chatId: chat.id });
      if (String(chat.id) === String(routeChatId)) {
        navigate('/chats/user');
      }
    } catch {
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
    <div className="md:pl-2 flex">
      <div className="flex flex-col h-[100vh] w-min-content border-r">
        <header className="flex min-h-[72px] shrink-0 justify-center md:justify-start items-center border-b">
          {isMobile && <SidebarTrigger className="-ml-1" />}
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
          <div className="h-[85vh] w-full overflow-auto custom-scrollbar">{renderChatList()}</div>
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
          <div className="flex h-[72px] border-b bg-transparent items-center justify-between gap-2 px-2">
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
                  {selectedCompanion && onlineUsers.includes(String(selectedCompanion.user.id)) ? (
                    <span className="text-green-400">Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              </div>
            </div>

            {selectedCompanion && routeChatId && (
              <Button
                className="rounded-none cut cut-left-5 cut-right-5 bg-[--main-button] active:scale-95"
                onClick={handleStartVideoCall}
                title="Start video call"
              >
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
