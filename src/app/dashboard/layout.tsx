import type { Metadata } from "next";

// Applies to every /dashboard/* route (admin, buyer, seller). These are
// role-gated, private pages and should never be indexed by search engines.
export const metadata: Metadata = {
  title: "Dashboard | IGO Import & Export",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
