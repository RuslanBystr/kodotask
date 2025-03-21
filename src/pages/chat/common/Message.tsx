import { CopyCheckIcon, CopyIcon, TrashIcon } from 'lucide-react';
import { useRef } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useAddReactionMutation, useDeleteMessageMutation } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export const Message = ({
  message,
  setMessages,
}: {
  message: IMessageResponse;
  setMessages: React.Dispatch<React.SetStateAction<IMessageResponse[]>>;
}) => {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const [addReaction] = useAddReactionMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const isSender = userData?.id === message?.sender.id || userData?.id === message.sender;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleReaction = async (reaction: string | null) => {
    try {
      const updatedMessage = await addReaction({ id: message.id, reaction }).unwrap();

      if (updatedMessage) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === message.id ? { ...msg, reaction: updatedMessage.reaction } : msg)),
        );
      }
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const handleDeleteMessage = async () => {
    await deleteMessage(message.id).unwrap();
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
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

  return (
    <ContextMenu>
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
        {!isSender && (
          <div className="flex items-end mr-1">
            <Avatar className="size-9">
              <AvatarImage src={`${api}/file/${message.sender.avatar}`} alt={userData?.firstName} />
              <AvatarFallback>{message?.sender?.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        )}
        <ContextMenuTrigger
          className={`p-2 max-w-[75%] rounded-[17px] border border-gray-500 shadow-md text-white flex cursor-pointer hover:bg-[#445566] select-none 
            ${isSender ? 'bg-accent/20 rounded-tr-[8px] rounded-br-[2px]' : 'bg-[#354050] rounded-tl-[8px] rounded-bl-[2px]'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex flex-col">
            {!isSender && <p className="text-[12px] text-green-100">{message.sender.firstName}</p>}
            <p className="text-sm break-all">{message.content}</p>
            {message.voiceMessage !== null && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls className="audio h-10 max-w-[100%]" onContextMenu={(e) => e.stopPropagation()}>
                <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/webm" />
                <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
            {message.reaction && (
              <Button
                onClick={() => handleReaction(null)}
                className="mt-2 pl-1 h-6 w-[3em] text-[16px] border border-gray-400 -bottom-5 rounded-full bg-[#556677]"
              >
                {message.reaction}
              </Button>
            )}
          </div>
          <div className="w-auto h-full flex flex-col justify-end">
            <span className="text-[12px] text-gray-300 block pl-2 select-none">{messageTime}</span>
          </div>
        </ContextMenuTrigger>
      </div>
      <ContextMenuContent className="w-32 bg-card/90 rounded-none cut border-none cut-left-10 cut-right-10">
        <div className="flex border-b">
          <ContextMenuItem onClick={() => handleReaction('👍')}>👍</ContextMenuItem>
          <ContextMenuItem onClick={() => handleReaction('😂')}>😂</ContextMenuItem>
          <ContextMenuItem onClick={() => handleReaction('🔥')}>🔥</ContextMenuItem>
        </div>
        {message?.content?.length > 0 && (
          <ContextMenuItem inset onClick={handleCopyMessage}>
            Copy
            <ContextMenuShortcut>
              <CopyIcon />
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
        <ContextMenuItem inset onClick={handleDeleteMessage}>
          Delete
          <ContextMenuShortcut>
            <TrashIcon />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
