export interface SellerProduct {
  id: string;
  sellerEmail: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  description: string;
  imageUrl: string;
  moq: string;
  originCountry: string;
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
} as const;
