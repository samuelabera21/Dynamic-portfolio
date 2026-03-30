export type SocialLink = {
  id?: string;
  platform: string;
  url: string;
};

export type Profile = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  location: string | null;
  available: boolean;
  socialLinks: SocialLink[];
};

export type ProfilePayload = {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  location?: string;
  available: boolean;
  socialLinks: SocialLink[];
};
