import { ChatItemUIProps } from '@/pages/chat/private-chat/ChatItem';
import { IChatResponse, IUserChat } from '@/types/responses/IChatResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trim()}…` : s);

export class ChatItemBuilder {
  private chat!: IChatResponse;

  private userId!: string;

  private activeChatId!: number;

  private onlineUsers?: string[];

  private companion?: IUserChat;

  private result: Partial<ChatItemUIProps> = {};

  setChat(chat: IChatResponse) {
    this.chat = chat;
    return this;
  }

  setCurrentUser(userId: string) {
    this.userId = userId;
    return this;
  }

  setActiveChat(activeChatId: number) {
    this.activeChatId = activeChatId;
    return this;
  }

  setOnlineUsers(onlineUsers?: string[]) {
    this.onlineUsers = onlineUsers;
    return this;
  }

  resolveCompanion() {
    this.companion = this.chat.userChats?.find((uc) => String(uc.user.id) !== String(this.userId));
    return this;
  }

  buildTitle() {
    if (this.chat.type === 'GROUP') {
      this.result.title = this.chat.groupName ?? 'Group';
      return this;
    }

    const user = this.companion?.user;
    this.result.title = user?.firstName?.trim() || `User #${user?.id ?? 'unknown'}`;

    return this;
  }

  buildAvatar() {
    const avatar = this.companion?.user?.avatar;
    this.result.avatar = avatar ? `${api}/file/${avatar}` : undefined;
    return this;
  }

  buildPreview() {
    const message = this.chat.lastMessage;

    if (!message) {
      this.result.preview = 'No messages yet';
      return this;
    }

    if (message.content?.trim()) {
      this.result.preview = truncate(message.content.trim(), 36);
      return this;
    }

    if (message.file) {
      this.result.preview = 'Attachment';
      return this;
    }

    this.result.preview = 'Voice message';
    return this;
  }

  buildTime() {
    const date = this.chat.lastMessage?.createdAt;

    if (!date) {
      this.result.time = '';
      return this;
    }

    const d = new Date(date);
    // eslint-disable-next-line no-restricted-globals
    this.result.time = isNaN(d.getTime()) ? '' : d.toLocaleTimeString();

    return this;
  }

  buildOnline() {
    this.result.isOnline = this.chat.userChats.some((uc) => this.onlineUsers?.includes(String(uc.user.id)));
    return this;
  }

  buildActive() {
    this.result.isActive = this.chat.id === this.activeChatId;
    return this;
  }

  build(): ChatItemUIProps {
    return this.result as ChatItemUIProps;
  }
}

export const mapChatToChatItemProps = (
  chat: IChatResponse,
  userId: string,
  activeChatId: number,
  onlineUsers?: string[],
): ChatItemUIProps =>
  new ChatItemBuilder()
    .setChat(chat)
    .setCurrentUser(userId)
    .setActiveChat(activeChatId)
    .setOnlineUsers(onlineUsers)
    .resolveCompanion()
    .buildTitle()
    .buildAvatar()
    .buildPreview()
    .buildTime()
    .buildOnline()
    .buildActive()
    .build();
