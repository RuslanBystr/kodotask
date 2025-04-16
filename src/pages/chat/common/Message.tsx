import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  CheckCheckIcon,
  CopyCheckIcon,
  CopyIcon,
  CornerDownLeft,
  DownloadIcon,
  ReplyIcon,
  TrashIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import AudioPlayer from '@/components/ui/audio-player';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { DropdownMenuContent, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { getEnv } from '@/utils';
import { socket } from '@/utils/socket';

const { api } = getEnv();

export const Message = ({
  message,
  setReply,
}: {
  message: IMessageResponse;
  setReply: (reply: IMessageResponse) => void;
}) => {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const isSender = userData?.id === message?.sender.id || userData?.id === message.sender;
  const { id: chatId } = useParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const handleReadMark = useMemo(
    () => !message?.readByUsers?.find((user) => user.id === userData?.id),
    [message?.readByUsers, userData?.id],
  );

  useEffect(() => {
    if (message?.file?.uuid) {
      fetch(`${api}/file/${message.file.uuid}`)
        .then((response) => response.blob())
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
        })
        .catch(() => toast.error('Error fetching image'));
    }
  }, [message?.file?.uuid]);

  useEffect(() => {
    if (!(handleReadMark && !isSender && chatId && message.id)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          socket.emit('markMessageAsRead', { chatId, readByUserId: userData?.id, userId: message.id });
          obs.disconnect();
        }
      },
      { threshold: 0.8 },
    );

    if (messageRef.current) observer.observe(messageRef.current);

    return () => observer.disconnect();
  }, [chatId, handleReadMark, isSender, message, userData?.id]);

  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    toast(
      <div className="flex gap-2">
        <CopyCheckIcon />
        Message copied!
      </div>,
      {
        type: 'default',
        autoClose: 400,
        hideProgressBar: true,
        style: {
          backgroundColor: 'rgba(53,71,101,0.8)',
          color: '#ffffff',
          fontSize: '16px',
          borderRadius: '0px',
          clipPath: `polygon(
          10px 0%,  
          calc(100% - 10px) 0%, 
          100% 10px,  
          100% calc(100% - 10px), 
          calc(100% - 10px) 100%, 
          10px 100%, 
          0% calc(100% - 10px), 
          0% 10px
        )`,
        },
      },
    );
  };

  const handleReaction = useCallback(
    async (reaction: string | null) => {
      if (!chatId || !message.id) return;

      socket.emit('reaction', { chatId, id: message.id, reaction });
    },
    [chatId, message.id],
  );

  const handleDeleteMessage = async () => {
    if (!chatId || !message.id) return;

    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('removeMessage', { chatId, id: message.id });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    timeoutRef.current = setTimeout(() => {
      if (!(e.target as HTMLElement).closest('audio')) {
        e.preventDefault();
        document.dispatchEvent(new Event('contextmenu'));
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleReplyMessage = () => {
    setReply(message);
  };

  const handleDownload = () => {
    if (imageSrc) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = message.file?.uuid || 'downloaded-image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ContextMenu>
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
        {!isSender && (
          <div className="flex items-end mr-1">
            <Avatar className="size-9">
              <AvatarFallback>{message?.sender?.firstName?.[0] || 'U'}</AvatarFallback>
              <AvatarImage src={`${api}/file/${message.sender.avatar}`} alt={message.sender.firstName} />
            </Avatar>
          </div>
        )}
        <ContextMenuTrigger
          ref={messageRef}
          className={`relative p-2 max-w-[90%] md:max-w-[75%] rounded-[17px] border border-[#4FA3B8] shadow-md text-white flex cursor-pointer hover:bg-[#445566] select-none 
            ${
              isSender
                ? 'bg-[#374C53]/80 rounded-tr-[8px] rounded-br-[2px]'
                : 'bg-[#2C3E50]/80 rounded-tl-[8px] rounded-bl-[2px]'
            }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-col">
            {message?.file?.uuid && (
              <img className="md:max-w-[420px]" height={48} width={48} src={imageSrc} alt={message?.file?.createdAt} />
            )}
            {message.linkToMessage && (
              <div className="flex justify-between text-[12px] bg-[#557080] border-l-4 border-[#4FA3B8] w-full rounded-[6px] p-2 my-2">
                <div>
                  <p className="text-[#4fa3b8]">{message.linkToMessage?.sender.firstName}</p>
                  <p>
                    {message?.linkToMessage?.content ||
                      (message?.linkToMessage?.voiceMessage?.uuid ? 'Voice Message' : 'Photo')}
                  </p>
                </div>
                <CornerDownLeft className="h-4" />
              </div>
            )}
            {!isSender && <p className="text-[12px] text-green-100">{message.sender.firstName}</p>}
            <p className="text-sm break-all">{message.content}</p>
            {message.voiceMessage !== null && <AudioPlayer src={`${api}/file/${message.voiceMessage.uuid}`} />}
            {message.reaction && (
              <Button
                onClick={() => handleReaction(null)}
                className="mt-2 pl-1 h-6 w-[3em] text-[16px] border border-gray-400 -bottom-5 rounded-full bg-[#556677]"
              >
                {message.reaction}
              </Button>
            )}
          </div>
          <div className=" w-auto h-full flex flex-col justify-end">
            <div className="flex">
              <span className="text-[12px] text-gray-300 block pl-2 select-none">{messageTime}</span>
              {isSender && message.isRead && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-4 w-4 bg-transparent">
                    <CheckCheckIcon className="h-4 text-[#77ddff]" />
                  </DropdownMenuTrigger>
                  {message.readByUsers && (
                    <DropdownMenuContent className="bg-card/90 rounded-none cut border-none cut-left-5 cut-right-5">
                      {message.readByUsers.map((user) => (
                        <DropdownMenuLabel key={`read-by-user-${user.id}`} className="flex items-center">
                          <Avatar className="size-6 mr-2">
                            <AvatarImage src={`${api}/file/${user.avatar}`} alt={user.firstName} />
                            <AvatarFallback>{user.firstName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          {user.firstName}
                          <CheckCheckIcon className="h-4 text-[#77ddff] mr-1" />
                        </DropdownMenuLabel>
                      ))}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
      </div>
      <ContextMenuContent className="w-32 bg-card/90 rounded-none cut border-none cut-left-10 cut-right-10">
        <ContextMenuItem onClick={handleReplyMessage}>
          Reply
          <ContextMenuShortcut>
            <ReplyIcon />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <div className="flex justify-between">
          <ContextMenuItem onClick={() => handleReaction('👍')}>👍</ContextMenuItem>
          <ContextMenuItem onClick={() => handleReaction('😂')}>😂</ContextMenuItem>
          <ContextMenuItem onClick={() => handleReaction('🔥')}>🔥</ContextMenuItem>
        </div>
        <ContextMenuSeparator />
        {message?.content?.length > 0 && (
          <ContextMenuItem onClick={handleCopyMessage}>
            Copy
            <ContextMenuShortcut>
              <CopyIcon />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {message?.file?.uuid && (
          <ContextMenuItem onClick={handleDownload}>
            Download
            <ContextMenuShortcut>
              <DownloadIcon />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={handleDeleteMessage}>
          Delete
          <ContextMenuShortcut>
            <TrashIcon />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
