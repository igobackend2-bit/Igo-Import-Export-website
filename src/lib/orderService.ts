import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  // The catalog is quote-based (no fixed price is published per product), so
  // there is no real numeric price to attach at order time. This used to be
  // hardcoded to 0, which made every order look like it was worth $0.
  price?: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  // Optional and no longer fabricated as 0 — see pricingStatus below.
  totalAmount?: number;
  // "quote_requested" is the normal state for this site (pricing happens via
  // the trade desk, not at checkout). "priced" is reserved for if/when real
  // per-order pricing is added later.
  pricingStatus: "quote_requested" | "priced";
  status: OrderStatus;
  shippingAddress: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

/**
 * Get all orders (admin only).
 */
export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, "id">),
  }));
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const docRef = doc(db, "orders", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...(snapshot.data() as Omit<Order, "id">) };
  }
  return null;
}

/**
 * Update order status.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, "orders", id), { 
    status,
    updatedAt: serverTimestamp() 
  });
}

/**
 * Get orders by customer email
 */
export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("customerEmail", "==", email));
  const snapshot = await getDocs(q);
  const orders = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, "id">),
  }));
  return orders.sort((a, b) => {
    // Basic local sort to avoid needing a composite index
    const timeA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
    return timeB - timeA;
  });
}
