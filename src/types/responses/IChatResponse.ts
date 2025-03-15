export interface IChatResponse {
  id: number;
  type: 'PRIVATE' | 'GROUP';
  groupName: string | null;
  userChats: {
    id: number;
    name: string;
    avatar: string;
    user: {
      id: string;
      firstName: string;
    };
  }[];
}
