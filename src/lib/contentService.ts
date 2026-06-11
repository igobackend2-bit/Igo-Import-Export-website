// src/lib/contentService.ts
// Firestore CMS service for editable website content

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface WebsiteContent {
  [key: string]: string | number | boolean | string[];
}

/**
 * Get a content section document from Firestore.
 * e.g. getWebsiteContent("hero") returns the hero section data
 */
export async function getWebsiteContent(section: string): Promise<WebsiteContent | null> {
  const snap = await getDoc(doc(db, "website_content", section));
  if (!snap.exists()) return null;
  return snap.data() as WebsiteContent;
}

/**
 * Update a content section in Firestore.
 */
export async function updateWebsiteContent(
  section: string,
  data: WebsiteContent
): Promise<void> {
  await setDoc(
    doc(db, "website_content", section),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Get all content sections (admin dashboard).
 */
export async function getAllContent(): Promise<Record<string, WebsiteContent>> {
  const snap = await getDocs(collection(db, "website_content"));
  const result: Record<string, WebsiteContent> = {};
  snap.docs.forEach((d) => {
    result[d.id] = d.data() as WebsiteContent;
  });
  return result;
}

/**
 * Seed default website content if not already set.
 * Call this once from admin setup.
 */
export async function seedDefaultContent(): Promise<void> {
  const defaults: Record<string, WebsiteContent> = {
    hero: {
      headline: "India's Agri-Commodity Trade Desk",
      subheadline: "Sourced. Inspected. Shipped.",
      ctaText: "Post RFQ",
      ctaLink: "#rfq",
    },
    about: {
      title: "About IGO Import & Export",
      description:
        "IGO is India's dedicated managed trade desk for agricultural commodities. We bridge the gap between verified Indian farms and global buyers.",
    },
    contact: {
      email: "bankingbackend.indiagreen@gmail.com",
      phone: "+91 73977 89803",
      whatsapp: "+91 73977 89803",
      address: "India",
    },
    footer: {
      tagline: "Managed Trade Desk",
      copyright: "© 2025 IGO Import & Export. All rights reserved.",
    },
  };

  for (const [section, data] of Object.entries(defaults)) {
    const existing = await getDoc(doc(db, "website_content", section));
    if (!existing.exists()) {
      await setDoc(doc(db, "website_content", section), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    }
  }
}
