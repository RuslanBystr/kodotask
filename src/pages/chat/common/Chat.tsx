import EmojiPicker from 'emoji-picker-react';
import { Mic, PaperclipIcon, ReplyIcon, SendHorizonalIcon, SmileIcon, Square, XIcon } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { OpenFileModal } from '@/components/modals/open-file-modal/OpenFileModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Messages from '@/pages/chat/common/Messages';
import { useChatMessage } from '@/pages/chat/hooks/useChatMessage';
import { useFetchMessages } from '@/pages/chat/hooks/useFetchMessages';
import { useInitMessages } from '@/pages/chat/hooks/useInitMessages';
import { useSendFileMessage } from '@/pages/chat/hooks/useSendFileMessage';
import { useGetMessagesQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { socket } from '@/utils/socket';

import { useChatMicro } from '../hooks/useChatMicro';

export function Chat({ refetchChats }: { refetchChats: () => void }) {
  const { id } = useParams();

  const userData = useSelector(selectAuthenticatedUserSelector);

  const [newMessage, setNewMessage] = useState<string>('');
  const [newVoiceMessage, setNewVoiceMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [reply, setReply] = useState<IMessageResponse | null>(null);
  const [isTypes, setIsTyping] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    data: initialMessages,
    refetch,
    isLoading,
    isFetching,
  } = useGetMessagesQuery({ chatId: id as string, page, limit: 30 }, { skip: !id });
  const [recording, startRecording, stopRecording] = useChatMicro({ setNewVoiceMessage });
  useFetchMessages(id, page, refetch);
  useInitMessages({ initialMessages, setMessages });
  useChatMessage({ refetchChats, chatId: id, setMessages, setPage, userData, setIsTyping });
  const { fileUUId, setFileUUId, selectedFile, handleSendFile, handleFileSelect, isModalOpen, closeModal } =
    useSendFileMessage();

  const fetchMoreMessages = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() && !newVoiceMessage && !fileUUId) return;

    socket.emit('sendMessage', {
      senderId: userData?.id,
      chatId: id,
      content: newMessage.trim(),
      voiceMessage: newVoiceMessage,
      file: fileUUId,
      linkToMessage: reply?.id,
    });

    setNewMessage('');
    setNewVoiceMessage(null);
    setReply(null);
    setFileUUId(null);
  }, [newMessage, newVoiceMessage, fileUUId, userData?.id, id, reply?.id, setFileUUId]);

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    socket.emit('typing', { chatId: id, userId: userData?.id });
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (fileUUId) {
      sendMessage();
    }
  }, [fileUUId, sendMessage]);

  useEffect(() => {
    if (newVoiceMessage) sendMessage();
  }, [newVoiceMessage, sendMessage]);

  return id ? (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4">
      <div className="absolute inset-0 bg-transparent/10 pointer-events-none" />
      <div className="relative col-span-3 bg-transparent lg:col-span-2 flex flex-col h-[calc(100vh-72px)] w-full">
        {/* eslint-disable-next-line no-nested-ternary */}
        {messages.length ? (
          <Messages
            messageDetails={messages}
            loading={isFetching}
            fetchMoreMessages={fetchMoreMessages}
            setReply={setReply}
            typing={isTypes}
          />
        ) : isLoading || isFetching ? (
          <div className="flex justify-center items-center h-[calc(100vh-142px)]">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-142px)]" />
        )}

        <div>
          {reply && (
            <div className="flex justify-between bg-transparent p-2">
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
        {isModalOpen && (
          <OpenFileModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedFile={selectedFile}
            handleSendFile={handleSendFile}
          />
        )}
        <div className="sticky h-20 border-t px-2 py-2 flex items-center gap-2 z-50 safe-bottom">
          <Button
            className="w-10 bg-[#557799] rounded-full transition-all active:scale-95"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon />
          </Button>
          <Input className="hidden" type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" />
          <Input
            className="flex-1 rounded-full text-[12px] md:text-[14px]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleChangeMessage}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <div className="hidden md:block">
            <Button
              className="bg-[#336677] w-10 rounded-full transition-all active:scale-95"
              onClick={() => setShowPicker(!showPicker)}
            >
              <SmileIcon />
            </Button>
            {showPicker && (
              <div className="absolute bottom-20 right-0 mt-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <Button
            onClick={recording ? stopRecording : startRecording}
            className="bg-[#336677] w-10 rounded-full transition-all active:scale-95"
          >
            {recording ? <Square size={24} /> : <Mic size={24} />}
          </Button>
          <Button className="bg-[#668899] w-10 rounded-full transition-all active:scale-90" onClick={sendMessage}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
      <div className="hidden z-10 lg:block col-span-0 lg:col-span-1 p-2 w-full border-l bg-transparent/10" />
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-full">Select a chat to start messaging</div>
  );
}
