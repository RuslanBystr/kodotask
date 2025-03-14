import { clsx } from "clsx";
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PrivateChat } from "@/pages/chat/PrivateChat/PrivateChat";
import { selectAuthenticatedUserSelector } from "@/store";
import { IChatResponse } from '@/types/responses/IChatResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { getEnv } from "@/utils";

import { useMainChatsPage } from "./useMainChatsPage";

const { api } = getEnv();
const socket: Socket = io(api, { autoConnect: true });

const MainChatPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;

  const [activeChat, setActiveChat] = useState<IChatResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { chats } = useMainChatsPage();

  useEffect(() => {
    if (!userId) return;

    socket.emit("userConnected", userId);

    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("onlineUsers");
    };
  }, [userId]);

  const handleSelectedChat = useCallback(
    (chat: IChatResponse) => {
      setActiveChat(chat);
      navigate(`/chats/user/${chat.id}`);
    },
    [navigate]
  );

  const filterChats = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  }, []);

  const filteredChats = chats?.items?.filter((chat) => {
    const chatName =
      chat?.groupName || chat?.userChats?.[0]?.name || "";
    return chatName.toLowerCase().includes(searchQuery);
  });

  return (
    <div className="p-2">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="">Chats</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex h-[calc(100vh-72px)]">
        <div className="flex gap-1 w-min-content flex-col border-r pr-1 pt-2 md:p-2 bg-muted/10">
          <Input className='w-[5em] md:w-max text-[10px]' placeholder="Search" onChange={filterChats} />
          
          {!filteredChats ? (<div className='w-full h-full flex justify-center'><Loading size={32}/></div>) : filteredChats.map((chat) => {
            // const lastMessage = chat?.lastMessage || {};
            // const formattedDate = lastMessage?.createdAt
            //   ? new Date(lastMessage.createdAt).toLocaleTimeString(
            //     [],
            //     { hour: "2-digit", minute: "2-digit" }
            //   )
            //   : "";

            const receiver = chat?.userChats?.filter(userChat => Number(userChat?.user?.id) === userId)[0];
            const sender = chat?.userChats?.filter(userChat => Number(userChat?.user?.id) !== userId)[0];


            const chatName = chat?.groupName || receiver?.name || "";
            const isOnline = onlineUsers.includes(sender?.user?.id);

            return (
              <SidebarMenuButton
                key={chat.id}
                className={clsx(
                  "h-[3em] hover:bg-muted rounded-none border-b",
                  {
                    "border-b-2 rounded border- bg-card/50 shadow":
                      activeChat?.id === chat.id,
                  }
                )}
                onClick={() => handleSelectedChat(chat)}
              >
                <Avatar className="h-8 w-8 rounded-full relative">
                  <AvatarImage
                    src={receiver?.avatar ? `${api}/file/${receiver.avatar}` : ""}
                    alt="file"
                  />
                  <AvatarFallback>
                    {chatName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                  {isOnline && (
                    <span
                      className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border border-white"
                      title="Online"
                    />
                  )}
                </Avatar>

                <div className="hidden md:block w-full">
                  <div className="flex justify-between w-full">
                    <p>{chatName}</p>
                    {/* <p className="text-[10px] text-popover"> */}
                    {/*   {formattedDate} */}
                    {/* </p> */}
                  </div>
                  {/* <p className="text-accent">{lastMessage?.content}</p> */}
                </div>
              </SidebarMenuButton>
            );
          })}
        </div>

        <PrivateChat />
      </div>
    </div>
  );
};

export default MainChatPage;
