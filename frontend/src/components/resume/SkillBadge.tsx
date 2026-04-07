type SkillBadgeProps = {
  label: string;
};

export default function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <span className="rounded-full border border-gray-600 px-3 py-1 text-sm text-gray-200">
      {label}
    </span>
  );
}