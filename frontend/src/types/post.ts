export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
};

export type PostPayload = {
  title: string;
  content: string;
  published: boolean;
};
