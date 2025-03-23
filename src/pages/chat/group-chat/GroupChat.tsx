import EmojiPicker from 'emoji-picker-react';
import { MouseDownEvent } from 'emoji-picker-react/dist/config/config';
import { Mic, SendHorizonalIcon, SmileIcon, Square } from 'lucide-react';
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Messages from '@/pages/chat/common/Messages';
import { useChatMessage } from '@/pages/chat/hooks/useChatMessage';
import { useGetMessagesQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { socket } from '@/utils/socket';

import { useChatMicro } from '../hooks/useChatMicro';

export function GroupChat({ changeStatus }: { changeStatus: Dispatch<SetStateAction<string>> }) {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState<string>('');
  const [newVoiceMessage, setNewVoiceMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const { data: initialMessages, isLoading, refetch } = useGetMessagesQuery({ chatId: id, page, limit: 20 });
  const [showPicker, setShowPicker] = useState(false);
  const [recording, startRecording, stopRecording] = useChatMicro({ setNewVoiceMessage });

  const handleEmojiClick: MouseDownEvent = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    if (!id) return;

    refetch().then((response) => {
      if (response.data?.items) {
        setMessages(response.data.items);
      }
    });
  }, [id, refetch]);

  useChatMessage({ chatId: id, setMessages, setPage, userData, changeStatus });

  useEffect(() => {
    if (initialMessages?.items) {
      setMessages((prevMessages) => {
        // Prevent duplicate messages
        const newMessages = initialMessages.items.filter((msg) => !prevMessages.some((prev) => prev.id === msg.id));
        return [...newMessages, ...prevMessages];
      });
    }
  }, [initialMessages]);

  const fetchMoreMessages = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    refetch().then((response) => {
      if (response.data?.items.length) {
        setMessages((prevMessages) => {
          const newMessages =
            response?.data?.items.filter((msg) => !prevMessages.some((prev) => prev.id === msg.id)) || [];
          return [...newMessages, ...prevMessages];
        });
      }
    });
  }, [page, refetch]);

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
    };
    socket.emit('sendMessage', messageData);
    setNewMessage('');
    setNewVoiceMessage(null);
  }, [newMessage, newVoiceMessage, userData, id]);

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
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4">
      <div className="relative col-span-3 lg:col-span-2 flex flex-col h-[calc(100vh-72px)] w-full">
        {messages.length > 0 ? (
          <Messages messageDetails={messages} fetchMoreMessages={fetchMoreMessages} />
        ) : (
          <div className="flex flex-col p-2 w-full justify-center h-[calc(100vh-72px)]">
            {isLoading ? (
              <div className="flex justify-center">
                <Loading />
              </div>
            ) : (
              <p className="text-center text-gray-400">No messages yet</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 border-t pl-2 pt-4 md:p-4">
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
