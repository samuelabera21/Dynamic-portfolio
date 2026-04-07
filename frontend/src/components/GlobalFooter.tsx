"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getHome } from "@/lib/api";
import EnterpriseFooter from "@/components/home/EnterpriseFooter";
import { Profile } from "@/types/profile";

export default function GlobalFooter() {
  const pathname = usePathname();
  const hideOnAdmin = pathname.startsWith("/admin");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;
    if (hideOnAdmin) {
      return () => {
        mounted = false;
      };
    }

    const run = async () => {
      try {
        const home = await getHome();
        if (mounted) {
          setProfile(home.profile ?? null);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [hideOnAdmin]);

  if (hideOnAdmin || !profile) return null;

  return <EnterpriseFooter profile={profile} />;
}
