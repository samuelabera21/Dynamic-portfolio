export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type MessagePayload = {
  name: string;
  email: string;
  message: string;
};
