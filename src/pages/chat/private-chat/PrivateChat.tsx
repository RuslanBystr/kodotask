import EmojiPicker from 'emoji-picker-react';
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

export function PrivateChat({
  changeStatus,
  refetchChats,
}: {
  changeStatus: Dispatch<SetStateAction<string>>;
  refetchChats: () => void;
}) {
  const { id } = useParams();
  const userData = useSelector(selectAuthenticatedUserSelector);
  const [newMessage, setNewMessage] = useState('');
  const [newVoiceMessage, setNewVoiceMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<IMessageResponse | null>(null);

  const { data: initialMessages, refetch } = useGetMessagesQuery({ chatId: id, page, limit: 30 });
  const [recording, startRecording, stopRecording] = useChatMicro({ setNewVoiceMessage });

  useFetchMessages(id, page, refetch);
  useInitMessages({ initialMessages, setMessages });
  useChatMessage({ refetchChats, chatId: id, setMessages, setPage, userData, changeStatus });

  const fetchMoreMessages = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() && !newVoiceMessage) return;

    socket.emit('sendMessage', {
      senderId: userData?.id,
      chatId: id,
      content: newMessage.trim() || null,
      voiceMessage: newVoiceMessage,
      linkToMessage: reply?.id,
    });

    setNewMessage('');
    setNewVoiceMessage(null);
    setReply(null);
  }, [newMessage, newVoiceMessage, userData?.id, id, reply]);

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    socket.emit('typing', { chatId: id, userId: userData?.id });
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (newVoiceMessage) sendMessage();
  }, [newVoiceMessage, sendMessage]);

  return id ? (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4">
      <div className="absolute inset-0 bg-[#C8A27E]/30 pointer-events-none" />
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
        <div className="sticky h-20 border-t px-2 py-2 flex items-center gap-2 z-50 safe-bottom bg-[#384D54]/90">
          <Input
            className="flex-1 rounded-full text-[12px] md:text-[14px]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleChangeMessage}
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
          <Button onClick={recording ? stopRecording : startRecording} className="bg-[#336677] w-10 rounded-full">
            {recording ? <Square size={24} /> : <Mic size={24} />}
          </Button>
          <Button className="bg-[#668899] w-10 rounded-full" onClick={sendMessage}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
      <div className="hidden z-10 lg:block col-span-0 lg:col-span-1 p-2 w-full border-l bg-[#384D54]/90" />
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-full">Select a chat to start messaging</div>
  );
}
