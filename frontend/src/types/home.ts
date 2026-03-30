import { Profile } from "@/types/profile";
import { Project } from "@/types/project";
import { GroupedSkills } from "@/types/skill";
import { FeatureFlags } from "@/types/settings";

export type HomeData = {
  profile: Profile;
  featuredProjects: Project[];
  skills: GroupedSkills;
} & Partial<FeatureFlags>;
