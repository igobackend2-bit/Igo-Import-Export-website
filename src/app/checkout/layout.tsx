import type { Metadata } from "next";

// checkout/page.tsx is a client component and shouldn't be indexed by search
// engines (it's a transactional cart/checkout flow, not content).
export const metadata: Metadata = {
  title: "Cart & Checkout | IGO Import & Export",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
