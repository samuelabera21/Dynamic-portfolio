"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { unsubscribeNewsletter } from "@/lib/api";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const missingParams = !email || !token;
  const [status, setStatus] = useState<string>(
    missingParams ? "Unable to process request." : "Processing your request..."
  );
  const [error, setError] = useState<string | null>(
    missingParams ? "Missing unsubscribe information." : null
  );

  useEffect(() => {
    if (missingParams) {
      return;
    }

    const run = async () => {
      try {
        const result = await unsubscribeNewsletter(email, token);
        setStatus(result.message);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to unsubscribe right now.");
        setStatus("Request failed.");
      }
    };

    run();
  }, [email, token, missingParams]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-6 py-16 sm:px-10">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">Newsletter</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Manage your subscription</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">{status}</p>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
            Go to home
          </Link>
          <Link href="/contact" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/5">
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<section className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-6 py-16 sm:px-10"><div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white shadow-xl backdrop-blur-xl sm:p-10"><p className="text-sm leading-7 text-slate-300">Processing your request...</p></div></section>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
