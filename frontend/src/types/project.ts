export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
};

export type ProjectFilters = {
  search?: string;
  tech?: string;
  featured?: boolean;
  includeUnpublished?: boolean;
};

export type ProjectPayload = {
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  featured: boolean;
  published: boolean;
};
