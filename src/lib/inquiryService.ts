// src/lib/inquiryService.ts
// Firestore service for contact forms, RFQs, and product inquiries

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type InquiryType = "contact" | "rfq" | "product_inquiry";
export type InquiryStatus = "new" | "read" | "replied" | "closed";

export interface Inquiry {
  id?: string;
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  product?: string;
  quantity?: string;
  destination?: string;
  status: InquiryStatus;
  createdAt?: Timestamp | string;
}

/**
 * Submit a new inquiry to Firestore.
 */
export async function submitInquiry(
  data: Omit<Inquiry, "id" | "status" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "inquiries"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Get all inquiries (admin only).
 */
export async function getAllInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Inquiry, "id">),
  }));
}

/**
 * Mark an inquiry as read.
 */
export async function markInquiryRead(id: string): Promise<void> {
  await updateDoc(doc(db, "inquiries", id), { status: "read" });
}

/**
 * Update inquiry status.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<void> {
  await updateDoc(doc(db, "inquiries", id), { status });
}
