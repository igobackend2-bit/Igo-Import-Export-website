"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-green-950 mb-3">
          Something Went Wrong
        </h1>
        <p className="text-brand-muted mb-8">
          An unexpected error occurred while loading this page. Please try again, or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-brand-line text-brand-ink font-bold rounded-lg hover:bg-brand-sage transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
