// src/lib/productService.ts
// Firestore service for product management

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type ProductStatus = "pending" | "approved" | "rejected";

export interface FirestoreProduct {
  id?: string;
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  moq: string;
  description?: string;
  originCountry: string;
  imageUrl?: string;
  tags?: string[];
  specs?: Record<string, string>;
  status: ProductStatus;
  sellerEmail: string;
  sellerUid?: string;
  rejectionReason?: string;
  adminNote?: string;
  submittedAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

/** Add a new product */
export async function addProduct(
  data: Omit<FirestoreProduct, "id" | "submittedAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "products"), {
    ...data,
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Get all products (admin) */
export async function getAllProducts(): Promise<FirestoreProduct[]> {
  const q = query(collection(db, "products"), orderBy("submittedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreProduct, "id">) }));
}

/** Get approved products (public catalog) */
export async function getApprovedProducts(): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, "products"),
    where("status", "==", "approved"),
    orderBy("submittedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreProduct, "id">) }));
}

/** Get products by seller email */
export async function getProductsBySellerEmail(email: string): Promise<FirestoreProduct[]> {
  const q = query(collection(db, "products"), where("sellerEmail", "==", email));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreProduct, "id">) }));
}

/** Get single product */
export async function getProductById(id: string): Promise<FirestoreProduct | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<FirestoreProduct, "id">) };
}

/** Update product fields */
export async function updateProduct(id: string, data: Partial<FirestoreProduct>): Promise<void> {
  await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
}

/** Approve product */
export async function approveProduct(id: string, adminEmail: string, note?: string): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    status: "approved",
    adminNote: note || "",
    updatedAt: serverTimestamp(),
  });
  await addAdminLog({ action: "approved", productId: id, adminEmail, note });
}

/** Reject product */
export async function rejectProduct(id: string, adminEmail: string, reason: string, note?: string): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    status: "rejected",
    rejectionReason: reason,
    adminNote: note || "",
    updatedAt: serverTimestamp(),
  });
  await addAdminLog({ action: "rejected", productId: id, adminEmail, note: reason });
}

/** Revoke product approval */
export async function revokeApproval(id: string, adminEmail: string): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    status: "pending",
    updatedAt: serverTimestamp(),
  });
  await addAdminLog({ action: "note_added", productId: id, adminEmail, note: "Approval revoked" });
}

/** Delete product */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

/** Add admin log entry */
export async function addAdminLog(data: {
  action: string;
  productId?: string;
  sellerEmail?: string;
  adminEmail: string;
  note?: string;
}): Promise<void> {
  await addDoc(collection(db, "admin_logs"), {
    ...data,
    timestamp: serverTimestamp(),
  });
}

/** Get admin logs */
export async function getAdminLogs(): Promise<Array<{
  id: string; action: string; productId?: string;
  sellerEmail?: string; adminEmail: string; note?: string; timestamp: Timestamp;
}>> {
  const q = query(collection(db, "admin_logs"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

/** Get Seller Profiles */
export async function getSellerProfiles(): Promise<Record<string, { isActive: boolean; registeredAt: string }>> {
  const q = query(collection(db, "users"), where("role", "==", "seller"));
  const snap = await getDocs(q);
  const profiles: Record<string, { isActive: boolean; registeredAt: string }> = {};
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.email) {
      profiles[data.email] = {
        isActive: data.isActive !== false, // default true
        registeredAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }
  });
  return profiles;
}

export async function isSellerActive(email: string): Promise<boolean> {
  const profiles = await getSellerProfiles();
  if (!profiles[email]) return true; // Default to active if not recorded
  return profiles[email].isActive;
}

/** Toggle Seller Active Status */
export async function toggleSellerActive(email: string, active: boolean, adminEmail: string): Promise<void> {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    const userDoc = snap.docs[0];
    await updateDoc(doc(db, "users", userDoc.id), { isActive: active });
  }

  if (!active) {
    // Reject all pending products
    const pQ = query(collection(db, "products"), where("sellerEmail", "==", email), where("status", "==", "pending"));
    const pSnap = await getDocs(pQ);
    for (const pDoc of pSnap.docs) {
      await updateDoc(doc(db, "products", pDoc.id), {
        status: "rejected",
        rejectionReason: "Seller account deactivated",
        updatedAt: serverTimestamp()
      });
    }
  }

  await addAdminLog({
    action: active ? "seller_activated" : "seller_deactivated",
    sellerEmail: email,
    adminEmail,
    note: active ? "Seller account activated" : "Seller account deactivated",
  });
}

/** Get Admin Settings */
export async function getAdminSettings(): Promise<{ autoApprove: boolean; welcomeMessage: string }> {
  const snap = await getDoc(doc(db, "settings", "admin"));
  if (snap.exists()) {
    return snap.data() as { autoApprove: boolean; welcomeMessage: string };
  }
  return { autoApprove: false, welcomeMessage: "" };
}

/** Save Admin Settings */
export async function saveAdminSettings(settings: { autoApprove: boolean; welcomeMessage: string }): Promise<void> {
  await setDoc(doc(db, "settings", "admin"), settings, { merge: true });
}
