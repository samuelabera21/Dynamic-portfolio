export type DashboardStats = {
  totalProjects: number;
  totalPosts: number;
  totalMessages: number;
  unreadMessages: number;
};

export type RecentMessageItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type RecentProjectItem = {
  id: string;
  title: string;
  createdAt: string;
};

export type RecentPostItem = {
  id: string;
  title: string;
  createdAt: string;
};