import type { Metadata } from "next";

// contact/page.tsx is a client component ("use client"), so it can't export
// its own metadata directly — this layout wraps it purely to attach
// page-specific metadata without touching the page's existing code.
export const metadata: Metadata = {
  title: "Contact Our Trade Desk | IGO Import & Export",
  description: "Get in touch with IGO's managed trade desk for quotes, sourcing requests, and operational queries. We respond within 24 hours.",
  openGraph: {
    title: "Contact Our Trade Desk | IGO Import & Export",
    description: "Get in touch with IGO's managed trade desk for quotes, sourcing requests, and operational queries.",
    url: "https://igogroups.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
