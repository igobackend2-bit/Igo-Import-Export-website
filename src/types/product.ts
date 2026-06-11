export interface SellerProduct {
  id: string;
  sellerEmail: string;
  sellerName?: string;
  submittedAt: string;
  updatedAt?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  adminNote?: string;
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  description: string;
  imageUrl: string;
  moq: string;
  originCountry: string;
  priceHistory?: Array<{ price: string; priceUnit: string; changedAt: string; changedBy: string }>;
  editHistory?: Array<{ field: string; oldValue: string; newValue: string; changedAt: string }>;
}

export interface SellerProfile {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  country?: string;
  registeredAt: string;
  isActive: boolean;
  totalProducts: number;
  approvedProducts: number;
}

export interface AdminLog {
  id: string;
  action: "approved" | "rejected" | "note_added" | "seller_deactivated" | "seller_activated";
  productId?: string;
  productName?: string;
  sellerEmail?: string;
  adminEmail: string;
  timestamp: string;
  note?: string;
}

export const PRODUCT_CATEGORIES = [
  "Rice",
  "Spices",
  "Pulses",
  "Grains",
  "Sugar",
  "Cotton",
  "Other",
] as const;

export const PRICE_UNITS = ["per MT", "per KG", "per Ton"] as const;

export const STORAGE_KEYS = {
  PENDING_PRODUCTS: "igo_pending_products",
  APPROVED_PRODUCTS: "igo_approved_products",
  SELLER_PROFILES: "igo_seller_profiles",
  ADMIN_LOGS: "igo_admin_logs",
  ADMIN_SETTINGS: "igo_admin_settings",
} as const;
