"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import EnterpriseFooter from "@/components/home/EnterpriseFooter";
import { Profile } from "@/types/profile";

type GlobalFooterProps = {
  initialProfile?: Profile | null;
};

export default function GlobalFooter({ initialProfile = null }: GlobalFooterProps) {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin");
  const [profile] = useState<Profile | null>(initialProfile);

  if (hideOnAdmin || !profile) return null;

  return <EnterpriseFooter profile={profile} />;
}
