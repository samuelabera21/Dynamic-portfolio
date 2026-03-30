export type SkillCategory = "frontend" | "backend" | "tools";

export type Skill = {
  id: string;
  name: string;
  category: string;
};

export type SkillPayload = {
  name: string;
  category: SkillCategory;
};

export type GroupedSkills = Record<string, string[]>;
