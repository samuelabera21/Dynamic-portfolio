export type FeatureFlags = {
  showProjects: boolean;
  showSkills: boolean;
  showBlog: boolean;
  availableForHire: boolean;
};

export type FeatureFlagKey = keyof FeatureFlags;