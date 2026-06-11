import { SellerProduct, AdminLog, STORAGE_KEYS } from "@/types/product";

export function getAllProducts(): SellerProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getApprovedProducts(): SellerProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPROVED_PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getProductById(id: string): SellerProduct | null {
  const all = getAllProducts();
  return all.find((p) => p.id === id) || null;
}

export function getProductsBySellerEmail(email: string): SellerProduct[] {
  const all = getAllProducts();
  return all.filter((p) => p.sellerEmail === email);
}

export function saveAllProducts(products: SellerProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_PRODUCTS, JSON.stringify(products));
  } catch {
    // ignore
  }
}

export function syncApprovedProducts(all: SellerProduct[]): void {
  try {
    const approved = all.filter((p) => p.status === "approved");
    localStorage.setItem(STORAGE_KEYS.APPROVED_PRODUCTS, JSON.stringify(approved));
  } catch {
    // ignore
  }
}

export function approveProduct(id: string, adminEmail: string, note?: string): SellerProduct[] {
  const all = getAllProducts();
  const product = all.find((p) => p.id === id);
  const updated = all.map((p) =>
    p.id === id ? { ...p, status: "approved" as const, adminNote: note || p.adminNote, updatedAt: new Date().toISOString() } : p
  );
  saveAllProducts(updated);
  syncApprovedProducts(updated);

  if (product) {
    addAdminLog({
      action: "approved",
      productId: product.id,
      productName: product.name,
      sellerEmail: product.sellerEmail,
      adminEmail,
      note,
    });
  }

  return updated;
}

export function rejectProduct(id: string, adminEmail: string, reason: string, note?: string): SellerProduct[] {
  const all = getAllProducts();
  const product = all.find((p) => p.id === id);
  const updated = all.map((p) =>
    p.id === id ? { ...p, status: "rejected" as const, rejectionReason: reason, adminNote: note || p.adminNote, updatedAt: new Date().toISOString() } : p
  );
  saveAllProducts(updated);
  syncApprovedProducts(updated);

  if (product) {
    addAdminLog({
      action: "rejected",
      productId: product.id,
      productName: product.name,
      sellerEmail: product.sellerEmail,
      adminEmail,
      note: reason,
    });
  }

  return updated;
}

export function revokeApproval(id: string, adminEmail: string): SellerProduct[] {
  const all = getAllProducts();
  const product = all.find((p) => p.id === id);
  const updated = all.map((p) =>
    p.id === id ? { ...p, status: "pending" as const, updatedAt: new Date().toISOString() } : p
  );
  saveAllProducts(updated);
  syncApprovedProducts(updated);

  if (product) {
    addAdminLog({
      action: "note_added",
      productId: product.id,
      productName: product.name,
      sellerEmail: product.sellerEmail,
      adminEmail,
      note: "Approval revoked",
    });
  }

  return updated;
}

export function getAdminLogs(): AdminLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addAdminLog(log: Omit<AdminLog, "id" | "timestamp">): void {
  try {
    const logs = getAdminLogs();
    logs.unshift({
      ...log,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function getSellerProfiles(): Record<string, { isActive: boolean; registeredAt: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SELLER_PROFILES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isSellerActive(email: string): boolean {
  const profiles = getSellerProfiles();
  if (!profiles[email]) return true; // Default to active if not recorded
  return profiles[email].isActive;
}

export function toggleSellerActive(email: string, active: boolean, adminEmail: string): void {
  const profiles = getSellerProfiles();
  profiles[email] = {
    ...profiles[email],
    isActive: active,
    registeredAt: profiles[email]?.registeredAt || new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEYS.SELLER_PROFILES, JSON.stringify(profiles));
  } catch {
    // ignore
  }

  if (!active) {
    // Reject all pending products
    let all = getAllProducts();
    let changed = false;
    all = all.map((p) => {
      if (p.sellerEmail === email && p.status === "pending") {
        changed = true;
        return { ...p, status: "rejected" as const, rejectionReason: "Seller account deactivated", updatedAt: new Date().toISOString() };
      }
      return p;
    });
    if (changed) {
      saveAllProducts(all);
      syncApprovedProducts(all);
    }
  }

  addAdminLog({
    action: active ? "seller_activated" : "seller_deactivated",
    sellerEmail: email,
    adminEmail,
    note: active ? "Seller account activated" : "Seller account deactivated",
  });
}

export function getAdminSettings(): { autoApprove: boolean; welcomeMessage: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { autoApprove: false, welcomeMessage: "" };
}

export function saveAdminSettings(settings: { autoApprove: boolean; welcomeMessage: string }): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
