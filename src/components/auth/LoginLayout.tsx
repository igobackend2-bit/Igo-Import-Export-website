import React, { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0e2417 0%, #163a25 30%, #1f5f8f 70%, #0e2417 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Suspense fallback={<div className="text-center text-white/60"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
