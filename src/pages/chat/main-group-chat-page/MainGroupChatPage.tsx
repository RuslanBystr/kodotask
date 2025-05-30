import { clsx } from 'clsx';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CreateGroupModal } from '@/components/modals/create-group-modal/CreateGroupModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminRoleEnum } from '@/enums';
import { ChatTypeEnum } from '@/enums/chat-type.enum';
import { Chat } from '@/pages/chat/common/Chat';
import { useFilterChats } from '@/pages/chat/hooks/useFilterChats';
import { useCreateGroupChatMutation } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IChatResponse } from '@/types/responses/IChatResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { getEnv } from '@/utils';

import { useMainChatsPage } from '../hooks/useMainChatsPage';

const { api } = getEnv();

const MainGroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;
  const [activeChat, setActiveChat] = useState<IChatResponse | null>(null);
  const [createGroupChat] = useCreateGroupChatMutation();
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');

  const { chats, refetch } = useMainChatsPage({ chatTypeQuery: ChatTypeEnum.GROUP });
  const { filterValue, filteredChats } = useFilterChats(chats?.items);

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      setActiveChat(chat);
      navigate(`/groups/${chat.id}`);
    },
    [navigate],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroupChat(groupName);
    } catch (err) {
      toast.error('fetch error');
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
    return filteredChats?.map((chat) => {
      const lastMessage = chat?.lastMessage;
      const formattedDate = lastMessage?.createdAt
        ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

      const receiver = chat?.userChats?.find((userChat) => Number(userChat?.user?.id) === userId);
      const sender = chat?.userChats?.find((userChat) => Number(userChat?.user?.id) !== userId);

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
              <AvatarImage src={receiver?.avatar ? `${api}/file/${sender?.user.avatar}` : ''} alt="file" />
              <AvatarFallback>{chatName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {chat?.messages?.length > 0 && (
              <div className="absolute sm:-left-1 md:right-0 bottom-0 bg-[#559965] w-4 h-4 rounded-full border border-green-200 text-[10px] flex justify-center items-center">
                {chat?.messages?.length > 99 ? '99' : chat?.messages?.length}
              </div>
            )}
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
    });
  };
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
          <div className="md:flex md:flex-row-reverse w-full gap-1">
            {userData?.role === AdminRoleEnum.ADMIN && (
              <Button
                className="transition-all active:scale-95 bg-[--main-button] hover:bg-[--main-button-hover] rounded-none cut cut-left-5 cut-right-5"
                onClick={() => setOpenCreateGroupModal(true)}
              >
                <PlusIcon />
              </Button>
            )}
            <CreateGroupModal open={openCreateGroupModal} setOpen={setOpenCreateGroupModal}>
              <form onSubmit={handleSubmit}>
                <Input
                  className="rounded-none"
                  placeholder="Group Chat Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button type="submit" className="bg-[--main-button] rounded-none cut cut-left-5 cut-right-5">
                  Create
                </Button>
              </form>
            </CreateGroupModal>

            <Input className="p-2 text-[10px]" placeholder="Search" onChange={filterValue} />
          </div>
          <div className="h-[85vh] w-full overflow-auto custom-scrollbar">{renderChatList()}</div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex items-center w-full min-h-16 pl-6 border-b">
          <p>{activeChat && activeChat.groupName}</p>
          <p className="text-[12px]">{activeChat && <p>Members</p>}</p>
        </div>
        <Chat refetchChats={refetch} />
      </div>
    </div>
  );
};

export default MainGroupChatPage;
