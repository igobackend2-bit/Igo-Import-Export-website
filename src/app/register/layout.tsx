import type { Metadata } from "next";

// register/page.tsx is a client component, so metadata is attached here
// instead, without modifying the existing page code.
export const metadata: Metadata = {
  title: "Create an Account | IGO Import & Export",
  description: "Register as a buyer or seller on IGO's managed agri-commodity trade platform.",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
