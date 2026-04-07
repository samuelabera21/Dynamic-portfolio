export type SkillCategory = string;

export type Skill = {
  id: string;
  name: string;
  category: string;
};

export type SkillPayload = {
  name: string;
  category: string;
};

export type GroupedSkills = Record<string, string[]>;
