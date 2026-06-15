import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export type NotificationType = "order" | "product" | "rfq" | "system" | "status";

export interface AppNotification {
  id?: string;
  recipientEmail: string;
  recipientRole: "admin" | "seller" | "buyer";
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt?: Timestamp | string;
}

/** Send a notification to a specific user */
export async function sendNotification(
  data: Omit<AppNotification, "id" | "isRead" | "createdAt">
): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    ...data,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}

/** Get notifications for a specific user */
export async function getNotificationsForUser(
  email: string
): Promise<AppNotification[]> {
  const q = query(
    collection(db, "notifications"),
    where("recipientEmail", "==", email)
  );
  const snap = await getDocs(q);
  const notifs = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<AppNotification, "id">),
  }));
  return notifs.sort((a, b) => {
    const timeA = a.createdAt instanceof Timestamp
      ? a.createdAt.toMillis()
      : new Date(a.createdAt as string || 0).getTime();
    const timeB = b.createdAt instanceof Timestamp
      ? b.createdAt.toMillis()
      : new Date(b.createdAt as string || 0).getTime();
    return timeB - timeA;
  });
}

/** Mark a single notification as read */
export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { isRead: true });
}

/** Mark all notifications for a user as read */
export async function markAllNotificationsRead(email: string): Promise<void> {
  const q = query(
    collection(db, "notifications"),
    where("recipientEmail", "==", email),
    where("isRead", "==", false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { isRead: true }));
  await batch.commit();
}

/** Admin helper: notify all admins */
export async function notifyAdmins(
  adminEmails: string[],
  data: Omit<AppNotification, "id" | "isRead" | "createdAt" | "recipientEmail" | "recipientRole">
): Promise<void> {
  for (const email of adminEmails) {
    await sendNotification({ ...data, recipientEmail: email, recipientRole: "admin" });
  }
}
