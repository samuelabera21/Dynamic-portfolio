"use client";

import { FormEvent, useState } from "react";
import { sendMessage } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function InfoIcon({ kind }: { kind: "address" | "phone" | "email" }) {
  if (kind === "address") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M12 21s-7-5.8-7-11a7 7 0 1 1 14 0c0 5.2-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    );
  }

  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2L8 9.4a16 16 0 0 0 6.6 6.6l1.1-1.1a2 2 0 0 1 2-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 11 15.4 6.9M8.6 13l6.8 4.1" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const messageBody = form.subject.trim()
        ? `Subject: ${form.subject.trim()}\n\n${form.message}`
        : form.message;

      await sendMessage({
        name: form.name,
        email: form.email,
        message: messageBody,
      });
      setSuccess("Your message was sent. A confirmation reply will be sent to your email address.");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#060c18] px-6 pb-12 pt-12 sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Contact</p>
          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-white sm:text-4xl">CONTACT</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Send your project idea, collaboration request, or question. I usually respond quickly with next steps.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-cyan-300/35 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="address" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-white sm:text-xl">Address</h2>
                  <p className="mt-1 text-sm text-slate-200">Ethiopia</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="phone" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-white sm:text-xl">Call Me</h2>
                  <a href="tel:+251923010537" className="mt-1 block text-sm text-slate-200 hover:text-cyan-200">
                    +251923010537
                  </a>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/15 text-emerald-200">
                  <InfoIcon kind="email" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-white sm:text-xl">Email Me</h2>
                  <a href="mailto:Samuelabera.dev@gmail.com" className="mt-1 block text-sm text-slate-200 hover:text-cyan-200">
                    Samuelabera.dev@gmail.com
                  </a>
                </div>
              </div>
            </article>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(6,12,24,0.45)] backdrop-blur-xl sm:p-7">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Your Name"
              required
            />

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Your Email"
              required
            />

            <input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              className="sm:col-span-2 w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Subject"
            />

            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              className="sm:col-span-2 min-h-40 w-full rounded-xl border border-white/15 bg-[#0b1730]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
              placeholder="Message"
              required
            />

            {success ? (
              <p className="sm:col-span-2 rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">
                {success}
              </p>
            ) : null}

            {error ? (
              <p className="sm:col-span-2 rounded-xl border border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">
                {error}
              </p>
            ) : null}

              <div className="sm:col-span-2 flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-cyan-300/40 bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
