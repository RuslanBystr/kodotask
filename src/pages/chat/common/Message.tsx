import { CopyCheckIcon, CopyIcon, TrashIcon } from 'lucide-react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useDeleteMessageMutation } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export const Message = ({ message, onDelete }: { message: IMessageResponse; onDelete: (id: number) => void }) => {
  const userData = useSelector(selectAuthenticatedUserSelector);
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

  const handleDeleteMessage = async () => {
    await deleteMessage(message.id).unwrap();
    onDelete(message.id);
  };

  const handleTouchStart = () => {
    timeoutRef.current = setTimeout(() => {
      document.dispatchEvent(new Event('contextmenu'));
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
        <ContextMenuTrigger
          className={`p-2 max-w-[75%] rounded-[12px] border border-gray-500 shadow-md text-white flex cursor-pointer hover:bg-gray-600 select-none 
            ${isSender ? 'bg-accent/20 rounded-tr-[8px] rounded-br-[2px]' : 'bg-[#354050] rounded-tl-[8px] rounded-bl-[2px]'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <p className="text-sm break-all">{message.content}</p>
          {message.voiceMessage !== null && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio controls className="audio">
              <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/webm" />
              <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/mp3" />
              <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/mp4" />
              Your browser does not support the audio element.
            </audio>
          )}
          <span className="text-[10px] text-gray-300 block mt-1 float-right pl-2 select-none">{messageTime}</span>
        </ContextMenuTrigger>
      </div>
      <ContextMenuContent className="w-32 bg-card">
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
