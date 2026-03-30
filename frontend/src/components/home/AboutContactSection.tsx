"use client";

import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
};

export default function AboutContactSection({ profile }: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <Image src="/5996986316723701435.jpg" alt="About visual" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />

        <div className="relative">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">About</p>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">Who I Am</h2>
            </div>
            <Link href="/about" className="text-sm font-semibold text-blue-200 hover:text-blue-100">
              Full story
            </Link>
          </div>

          <p className="text-sm leading-7 text-slate-200">{profile.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
              {profile.role}
            </span>
            {profile.location ? (
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                {profile.location}
              </span>
            ) : null}
          </div>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-br from-slate-900 via-blue-900 to-violet-800 p-6 shadow-[0_0_36px_rgba(59,130,246,0.2)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Contact</p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-white">Let&apos;s Build Something Powerful Together</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-200">
            Have a project, internship, or product idea? Let&apos;s collaborate on meaningful software engineering systems.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              Contact Me
            </Link>
            <Link href="/projects" className="rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15">
              Start Project
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
