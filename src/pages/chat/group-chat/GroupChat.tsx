import EmojiPicker from 'emoji-picker-react';
import { MouseDownEvent } from 'emoji-picker-react/dist/config/config';
import { Mic, ReplyIcon, SendHorizonalIcon, SmileIcon, Square, XIcon } from 'lucide-react';
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Messages from '@/pages/chat/common/Messages';
import { useChatMessage } from '@/pages/chat/hooks/useChatMessage';
import { useFetchMessages } from '@/pages/chat/hooks/useFetchMessages';
import { useInitMessages } from '@/pages/chat/hooks/useInitMessages';
import { useGetMessagesQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { socket } from '@/utils/socket';

import { useChatMicro } from '../hooks/useChatMicro';

export function GroupChat({
  changeStatus,
  refetchChats,
}: {
  changeStatus: Dispatch<SetStateAction<string>>;
  refetchChats: () => void;
}) {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState<string>('');
  const [newVoiceMessage, setNewVoiceMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const { data: initialMessages, refetch } = useGetMessagesQuery({ chatId: id, page, limit: 20 });
  const [showPicker, setShowPicker] = useState(false);
  const [recording, startRecording, stopRecording] = useChatMicro({ setNewVoiceMessage });
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<IMessageResponse | null>(null);

  const handleEmojiClick: MouseDownEvent = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  useFetchMessages(id, page, refetch);
  useInitMessages({ initialMessages, setMessages });
  useChatMessage({ refetchChats, chatId: id, setMessages, setPage, userData, changeStatus });

  const fetchMoreMessages = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const sendMessage = useCallback(() => {
    if (newMessage === '' && newVoiceMessage === null) return;

    if (newVoiceMessage !== null) {
      setNewMessage('');
    }

    const messageData = {
      senderId: userData?.id,
      chatId: id,
      content: newMessage.trim() === '' ? null : newMessage.trim(),
      voiceMessage: newVoiceMessage,
      linkToMessage: reply?.id,
    };
    socket.emit('sendMessage', messageData);
    setNewMessage('');
    setNewVoiceMessage(null);
    setReply(null);
  }, [newMessage, newVoiceMessage, userData?.id, id, reply?.id]);

  useEffect(() => {
    if (newVoiceMessage) {
      sendMessage();
    }
  }, [newVoiceMessage, sendMessage]);

  const handleStopRecording = async () => {
    stopRecording();
  };

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    socket.emit('typing', { chatId: id, userId: userData?.id });
    setNewMessage(e.target.value);
  };

  return id ? (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4">
      <div className="relative col-span-3 lg:col-span-2 flex flex-col h-[calc(100vh-72px)] w-full">
        {/* eslint-disable-next-line no-nested-ternary */}
        {messages.length ? (
          <Messages
            messageDetails={messages}
            loading={loading}
            setLoading={setLoading}
            fetchMoreMessages={fetchMoreMessages}
            setReply={setReply}
          />
        ) : loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-142px)]">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-142px)]" />
        )}
        <div>
          {reply && (
            <div className="flex justify-between bg-[#394E56] p-2">
              <ReplyIcon />
              <div>
                <p className="text-[#4FA3B8]">Reply to {reply.sender.firstName}</p>
                <p>{reply.content}</p>
              </div>
              <div className="flex flex-1 justify-end">
                <Button className="rounded-none bg-transparent" onClick={() => setReply(null)}>
                  <XIcon />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-2 right-0 border-t p-4 md:p-4 flex items-center gap-2 z-50 safe-bottom">
          <Input
            className="flex-1 rounded-full text-[12px] md:text-[14px]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => handleChangeMessage(e)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <div className="hidden md:block">
            <Button className="bg-[#336677] w-10 rounded-full" onClick={() => setShowPicker(!showPicker)}>
              <SmileIcon />
            </Button>
            {showPicker && (
              <div className="absolute bottom-20 right-0 mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={recording ? handleStopRecording : startRecording}
              className="bg-[#336677] w-10 rounded-full transition duration-300 ease-in-out"
            >
              {recording ? <Square size={24} /> : <Mic size={24} />}
            </Button>
          </div>

          <Button className="bg-[#668899] w-10 rounded-full" onClick={sendMessage}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block col-span-0 lg:col-span-1 p-2 w-full border-l bg-muted/30" />
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-full">Select a chat to start messaging</div>
  );
}
