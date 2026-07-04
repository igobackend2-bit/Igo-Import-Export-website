import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import GoogleTranslate from "@/components/layout/GoogleTranslate";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://igogroups.com"),
  title: "IGO Import & Export | India's Agri-Commodity Trade Desk",
  description: "IGO Import & Export — India's dedicated agri-commodity trade desk. We handle sourcing, quality inspection, export documentation, and freight for global buyers.",
  keywords: "IGO Import Export, agricultural export India, managed trade service, global commodity trade, rice export India, spices export, palm jaggery export, fertilizer import, export documentation, phytosanitary certificate, B2B agri trade India",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IGO Import & Export | India's Agri-Commodity Trade Desk",
    description: "Sourced. Inspected. Shipped. The ultimate sovereign gateway to Indian agriculture.",
    url: "https://igogroups.com",
    siteName: "IGO Import & Export",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IGO Import & Export | India's Agri-Commodity Trade Desk",
    description: "Sourced. Inspected. Shipped. The ultimate sovereign gateway to Indian agriculture.",
  },
};

// Organization structured data (JSON-LD) so search engines and AI answer
// engines can correctly identify the business, its contact info, and address.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IGO Import & Export",
  url: "https://igogroups.com",
  description: "India's managed agri-commodity trade desk handling sourcing, quality inspection, export documentation, and freight for global buyers.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 17, Kovalan Street, 2nd Main Road, Uthandi Kanathur",
    addressLocality: "Chennai",
    postalCode: "600119",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "bd2@igogroups.com",
      telephone: "+91-73977-89803",
      areaServed: "Worldwide",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-brand-paper text-brand-ink">
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <GoogleTranslate />
              <Navbar />
              {children}
              <Footer />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
