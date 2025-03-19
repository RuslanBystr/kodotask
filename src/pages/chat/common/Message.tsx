import { useSelector } from 'react-redux';

import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export const Message = ({ message }: { message: IMessageResponse }) => {
  const userData = useSelector(selectAuthenticatedUserSelector);

  const isSender = userData?.id === message?.sender.id || userData?.id === message.sender;

  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-2 max-w-[75%] rounded-[12px] border-1 shadow-md text-white flex
        ${isSender ? 'bg-gray-500 border-gray-800 rounded-tr-[8px]' : 'bg-gray-400 border-gray-600 rounded-tl-[8px]'} 
        ${isSender ? 'rounded-br-[2px]' : 'rounded-bl-[2px]'}`}
      >
        <p className="text-sm">{message.content}</p>
        {message.voiceMessage !== null && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <audio controls className="audio">
            <source src={`${api}/file/${message.voiceMessage.uuid}`} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        )}
        <span className="text-[10px] text-gray-300 block mt-1 float-right pl-2">{messageTime}</span>
      </div>
    </div>
  );
};
