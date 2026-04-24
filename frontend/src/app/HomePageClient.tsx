"use client";

import { useEffect, useState } from "react";
import { getHome } from "@/lib/api";
import { HomeData } from "@/types/home";
import SectionShell from "@/components/home/SectionShell";
import HeroSection from "@/components/home/HeroSection";
import FeatureGridSection from "@/components/home/FeatureGridSection";
import EcosystemSection from "@/components/home/EcosystemSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import SkillsFlipSection from "@/components/home/SkillsFlipSection";
import TimelineSection from "@/components/home/TimelineSection";
import InsightsSection from "@/components/home/InsightsSection";
import CtaSection from "@/components/home/CtaSection";

type HomePageClientProps = {
  initialHomeData?: HomeData | null;
  initialError?: string | null;
};

export default function HomePageClient({
  initialHomeData = null,
  initialError = null,
}: HomePageClientProps) {
  const [homeData, setHomeData] = useState<HomeData | null>(initialHomeData);
  const [loading, setLoading] = useState(!initialHomeData && !initialError);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    if (initialHomeData) return;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHome();
        setHomeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load homepage");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [initialHomeData]);

  if (loading) {
    return (
      <section className="space-y-8 bg-[#060c18] px-6 py-8 sm:px-10">
        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
          ))}
        </div>
      </section>
    );
  }

  const hasHomeData = Boolean(homeData);
  const profile = homeData?.profile;
  const featuredProjects = homeData?.featuredProjects ?? [];
  const skills = homeData?.skills;
  const showProjects = homeData?.showProjects ?? true;
  const showSkills = homeData?.showSkills ?? true;
  const availableForHire = homeData?.availableForHire ?? true;

  return (
    <section className="relative space-y-10 overflow-hidden bg-[#060c18] pb-0">
      <div className="pointer-events-none absolute -left-40 top-16 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-80 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative space-y-14 px-0 pt-0">
        {error || !hasHomeData ? (
          <div className="mx-6 rounded-2xl border border-red-400/30 bg-[#0b0f19] p-6 shadow-lg sm:mx-10 lg:mx-12">
            <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">Homepage Data Unavailable</h1>
            <p className="mt-2 text-sm font-medium text-red-300">{error ?? "Could not load homepage data."}</p>
            <p className="mt-1 text-sm text-slate-300">
              Dynamic content is temporarily unavailable. Static sections are still visible while backend data recovers.
            </p>
          </div>
        ) : null}

        {hasHomeData && profile ? (
          <>
            <HeroSection profile={profile} showAvailableForHire={availableForHire} />

            <div className="mx-6 sm:mx-10 lg:mx-12">
              <CtaSection bio={profile.bio} />
            </div>

            {showProjects ? (
              <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
                <FeaturedProjectsSection projects={featuredProjects} />
              </SectionShell>
            ) : null}

            {showSkills && skills ? (
              <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
                <SkillsFlipSection skills={skills} />
              </SectionShell>
            ) : null}
          </>
        ) : null}

        <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
          <TimelineSection />
        </SectionShell>

        <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
          <InsightsSection />
        </SectionShell>

        <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
          <EcosystemSection />
        </SectionShell>

        <SectionShell className="mx-6 sm:mx-10 lg:mx-12">
          <FeatureGridSection />
        </SectionShell>

      </div>
    </section>
  );
}
