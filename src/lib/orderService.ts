import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
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
  price: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
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
