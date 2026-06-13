"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SellerProduct, AdminLog } from "@/types/product";
import {
  getAllProducts,
  approveProduct,
  rejectProduct,
  revokeApproval,
  getAdminLogs,
  getSellerProfiles,
  toggleSellerActive,
  getAdminSettings,
  saveAdminSettings,
  updateProduct,
} from "@/lib/productService";
import { getAllOrders, updateOrderStatus, Order, OrderStatus } from "@/lib/orderService";

type Tab = "overview" | "orders" | "pending" | "approved" | "rejected" | "all" | "sellers" | "activity" | "settings";
type SortBy = "date" | "status" | "category";
type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboard() {
  const router = useRouter();
  const { role, email: adminEmail, isAuthenticated, isLoading, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [allProducts, setAllProducts] = useState<SellerProduct[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [sellerProfiles, setSellerProfiles] = useState<Record<string, { isActive: boolean; registeredAt: string }>>({});
  const [settings, setSettings] = useState({ autoApprove: false, welcomeMessage: "" });
  
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRejectReason, setBulkRejectReason] = useState("");
  const [showBulkReject, setShowBulkReject] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatingOut, setAnimatingOut] = useState<string | null>(null);
  
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [logFilter, setLogFilter] = useState<"all" | "approvals" | "rejections" | "seller">("all");

  const [resetConfirm, setResetConfirm] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  const loadData = useCallback(async () => {
    const products = await getAllProducts();
    const logs = await getAdminLogs();
    const profiles = await getSellerProfiles();
    const sets = await getAdminSettings();
    const orders = await getAllOrders();
    
    // Convert timestamps for existing UI compatibility
    const formattedProducts = products.map((p) => ({
      ...p,
      submittedAt: typeof p.submittedAt === "object" && p.submittedAt !== null && "toDate" in p.submittedAt ? p.submittedAt.toDate().toISOString() : String(p.submittedAt || new Date().toISOString()),
      updatedAt: typeof p.updatedAt === "object" && p.updatedAt !== null && "toDate" in p.updatedAt ? p.updatedAt.toDate().toISOString() : String(p.updatedAt || new Date().toISOString()),
    })) as SellerProduct[];
    
    const formattedLogs = logs.map(l => ({
      ...l,
      timestamp: typeof l.timestamp === "object" && l.timestamp !== null && "toDate" in l.timestamp ? l.timestamp.toDate().toISOString() : String(l.timestamp || new Date().toISOString()),
    })) as AdminLog[];

    const formattedOrders = orders.map(o => ({
      ...o,
      createdAt: typeof o.createdAt === "object" && o.createdAt !== null && "toDate" in o.createdAt ? o.createdAt.toDate().toISOString() : String(o.createdAt || new Date().toISOString()),
      updatedAt: typeof o.updatedAt === "object" && o.updatedAt !== null && "toDate" in o.updatedAt ? o.updatedAt.toDate().toISOString() : String(o.updatedAt || new Date().toISOString()),
    })) as Order[];

    setAllProducts(formattedProducts);
    setAdminLogs(formattedLogs);
    setSellerProfiles(profiles);
    setSettings(sets);
    setAllOrders(formattedOrders);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("Admin Dashboard - Current Role:", role, "isLoading:", isLoading);
    if (mounted && !isLoading && (!isAuthenticated || role !== "admin")) {
      router.push("/login?role=admin");
    }
  }, [mounted, isLoading, isAuthenticated, role, router]);

  useEffect(() => {
    if (mounted && !isLoading && role === "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [mounted, isLoading, role, loadData]);

  if (!mounted || isLoading) return <div className="min-h-screen flex items-center justify-center text-brand-muted">Loading Admin Dashboard...</div>;
  if (role !== "admin") return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (id: string) => {
    setAnimatingOut(id);
    setTimeout(async () => {
      await approveProduct(id, adminEmail || "admin@igo.com", adminNote[id]);
      await loadData();
      setAnimatingOut(null);
      showToast("Product approved successfully!");
    }, 400);
  };

  const handleReject = (id: string) => {
    if (!rejectReason) return showToast("Reason is required");
    setAnimatingOut(id);
    setTimeout(async () => {
      await rejectProduct(id, adminEmail || "admin@igo.com", rejectReason, adminNote[id]);
      await loadData();
      setRejectId(null);
      setRejectReason("");
      setAnimatingOut(null);
      showToast("Product rejected.");
    }, 400);
  };
  
  const handleRevoke = async (id: string) => {
    await revokeApproval(id, adminEmail || "admin@igo.com");
    await loadData();
    showToast("Approval revoked.");
  };

  const handleReconsider = async (id: string) => {
    await updateProduct(id, { status: "pending" });
    await loadData();
    showToast("Product moved back to pending.");
  };

  const handleOrderStatusUpdate = async (id: string, newStatus: Order["status"]) => {
    await updateOrderStatus(id, newStatus);
    await loadData();
    showToast(`Order status updated to ${newStatus}`);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBulkAction = async (_action: string) => {
    for (const id of Array.from(selectedIds)) {
      await approveProduct(id, adminEmail || "admin@igo.com", adminNote[id]);
    }
    setSelectedIds(new Set());
    await loadData();
    showToast(`Approved ${selectedIds.size} products.`);
  };

  const handleBulkApprove = async () => {
    for (const id of Array.from(selectedIds)) {
      await approveProduct(id, adminEmail || "admin@igo.com", adminNote[id]);
    }
    setSelectedIds(new Set());
    await loadData();
    showToast(`Approved ${selectedIds.size} products.`);
  };

  const handleBulkReject = async () => {
    if (!bulkRejectReason) return showToast("Reason is required for bulk reject");
    for (const id of Array.from(selectedIds)) {
      await rejectProduct(id, adminEmail || "admin@igo.com", bulkRejectReason, adminNote[id]);
    }
    setSelectedIds(new Set());
    setBulkRejectReason("");
    setShowBulkReject(false);
    await loadData();
    showToast(`Rejected ${selectedIds.size} products.`);
  };

  const handleToggleSeller = async (email: string, active: boolean) => {
    await toggleSellerActive(email, active, adminEmail || "admin@igo.com");
    await loadData();
    showToast(active ? "Seller activated" : "Seller deactivated");
  };

  const handleSaveSettings = async () => {
    await saveAdminSettings(settings);
    await loadData();
    showToast("Settings saved");
  };

  const handleResetData = () => {
    if (resetConfirm === "RESET") {
      // Disabled for production Firebase setup
      setShowResetModal(false);
      setResetConfirm("");
      showToast("Data reset disabled in production environment.");
    } else {
      showToast("Type RESET to confirm");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Category", "Status", "Price", "Unit", "MOQ", "Origin", "Seller Email", "Submitted At", "Updated At"];
    const rows = allProducts.map(p => [
      p.id, p.name, p.category, p.status, p.price, p.priceUnit, p.moq, p.originCountry, p.sellerEmail, p.submittedAt, p.updatedAt || ""
    ].map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "igo_products.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const pendingProducts = allProducts.filter(p => p.status === "pending").sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  const approvedProducts = allProducts.filter(p => p.status === "approved");
  const rejectedProducts = allProducts.filter(p => p.status === "rejected");
  
  const today = new Date().toDateString();
  const approvedToday = allProducts.filter(p => p.status === "approved" && new Date(p.updatedAt || p.submittedAt).toDateString() === today).length;
  
  // Get unique sellers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sellersMap = new Map<string, any>();
  allProducts.forEach(p => {
    if (!sellersMap.has(p.sellerEmail)) {
      sellersMap.set(p.sellerEmail, { email: p.sellerEmail, total: 0, pending: 0, approved: 0, rejected: 0, firstSubmission: p.submittedAt });
    }
    const s = sellersMap.get(p.sellerEmail);
    s.total++;
    s[p.status]++;
    if (new Date(p.submittedAt) < new Date(s.firstSubmission)) s.firstSubmission = p.submittedAt;
  });
  const sellersList = Array.from(sellersMap.values()).map(s => {
    const profile = sellerProfiles[s.email];
    return { ...s, isActive: profile ? profile.isActive : true };
  });
  const activeSellersCount = sellersList.filter(s => s.isActive).length;

  const stats = {
    total: allProducts.length,
    pending: pendingProducts.length,
    approved: approvedProducts.length,
    rejected: rejectedProducts.length,
    activeSellers: activeSellersCount,
    approvedToday
  };

  const getFilteredSortedProducts = (products: SellerProduct[]) => {
    let filtered = [...products];
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sellerEmail.toLowerCase().includes(q));
    }
    if (sellerFilter) {
      filtered = filtered.filter(p => p.sellerEmail === sellerFilter);
    }
    filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });
    return filtered;
  };

  const statusBadge = (status: SellerProduct["status"]) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    const icons = { pending: "🟡", approved: "✅", rejected: "❌" };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const sidebarItems: { key: Tab; label: string; icon: string; badge?: number }[] = [
    { key: "overview", label: "Dashboard", icon: "fa-chart-pie" },
    { key: "orders", label: "Orders", icon: "fa-shopping-cart", badge: allOrders.filter(o => o.status === "pending").length },
    { key: "pending", label: "Pending Review", icon: "fa-clock", badge: stats.pending },
    { key: "approved", label: "Approved Products", icon: "fa-check-circle" },
    { key: "rejected", label: "Rejected Products", icon: "fa-times-circle" },
    { key: "all", label: "All Products", icon: "fa-table-list" },
    { key: "sellers", label: "Sellers Management", icon: "fa-users" },
    { key: "activity", label: "Activity Log", icon: "fa-list-ol" },
    { key: "settings", label: "Admin Settings", icon: "fa-cog" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-amber flex items-center justify-center text-brand-ink font-bold text-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Super Admin</h3>
              <p className="text-xs text-white/40">IGO Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSellerFilter(""); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.key
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-brand-amber text-brand-ink text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]">
            <i className="fa-solid fa-circle-check text-brand-amber text-lg"></i>
            <span className="font-medium text-sm">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* SECTION 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-1">Dashboard Overview</h1>
            <p className="text-brand-muted mb-8">Platform product management overview.</p>
            
            {stats.pending > 0 && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-amber-800">
                  <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                  <span className="font-bold">{stats.pending} products awaiting review</span>
                </div>
                <button onClick={() => setActiveTab("pending")} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition">
                  Review Now →
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Submissions", value: stats.total, icon: "fa-layer-group", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Pending", value: stats.pending, icon: "fa-hourglass-half", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Approved", value: stats.approved, icon: "fa-check", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Rejected", value: stats.rejected, icon: "fa-times", color: "text-red-500", bg: "bg-red-50" },
                { label: "Active Sellers", value: stats.activeSellers, icon: "fa-users", color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Approved Today", value: stats.approvedToday, icon: "fa-calendar-check", color: "text-teal-600", bg: "bg-teal-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 border border-brand-line shadow-sm">
                  <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <i className={`fa-solid ${s.icon} ${s.color}`}></i>
                  </div>
                  <div className="text-3xl font-bold text-brand-ink">{s.value}</div>
                  <div className="text-xs text-brand-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Approval Rate */}
              <div className="bg-white rounded-xl border border-brand-line shadow-sm p-6">
                <h3 className="font-bold text-brand-ink mb-4">Approval Rate</h3>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${stats.total ? (stats.approved / stats.total) * 100 : 0}%` }}></div>
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${stats.total ? (stats.rejected / stats.total) * 100 : 0}%` }}></div>
                  <div className="bg-amber-400 h-full transition-all" style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-brand-muted">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Approved</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Pending</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl border border-brand-line shadow-sm p-6">
                <h3 className="font-bold text-brand-ink mb-4">Submissions by Category</h3>
                <div className="space-y-3">
                  {Object.entries(
                    allProducts.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {} as Record<string, number>)
                  ).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-brand-muted truncate">{cat}</div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-brand-green-700 h-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                      </div>
                      <div className="w-8 text-sm font-bold text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-xl border border-brand-line shadow-sm">
              <div className="p-5 border-b border-brand-line"><h2 className="font-bold text-brand-ink">Recent Activity</h2></div>
              <div className="divide-y divide-brand-line/50">
                {adminLogs.slice(0, 10).map((log) => {
                   const iconMap = { approved: "fa-check text-emerald-500", rejected: "fa-times text-red-500", note_added: "fa-comment text-blue-500", seller_deactivated: "fa-user-slash text-red-500", seller_activated: "fa-user-check text-emerald-500" };
                   return (
                     <div key={log.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                           <i className={`fa-solid ${iconMap[log.action]}`}></i>
                         </div>
                         <div>
                           <div className="text-sm font-medium text-brand-ink">
                             {log.action === "approved" && `Approved ${log.productName}`}
                             {log.action === "rejected" && `Rejected ${log.productName}`}
                             {log.action === "note_added" && `Added note to ${log.productName}`}
                             {log.action === "seller_deactivated" && `Deactivated seller ${log.sellerEmail}`}
                             {log.action === "seller_activated" && `Activated seller ${log.sellerEmail}`}
                           </div>
                           <div className="text-xs text-brand-muted">{log.sellerEmail}</div>
                         </div>
                       </div>
                       <div className="text-xs text-brand-muted">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                     </div>
                   );
                })}
                {adminLogs.length === 0 && <div className="p-6 text-center text-brand-muted">No activity yet</div>}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: ORDERS */}
        {activeTab === "orders" && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-1">Customer Orders</h1>
            <p className="text-brand-muted mb-6">Manage e-commerce orders, view details, and update statuses.</p>
            
            <div className="bg-white rounded-xl border border-brand-line shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-brand-line text-left">
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Total Amount</th>
                      <th className="px-4 py-3 font-medium">Items</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line/50">
                    {allOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-brand-muted">{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-brand-ink">{order.customerName}</div>
                          <div className="text-xs text-brand-muted">{order.customerEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-brand-muted">{new Date((order.createdAt as string) || "").toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-bold">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-brand-muted">
                          <div className="text-xs">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx}>{item.quantity}x {item.productName}</div>
                            ))}
                            {order.items.length > 2 && <div>+{order.items.length - 2} more</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={order.status} 
                            onChange={(e) => handleOrderStatusUpdate(order.id!, e.target.value as OrderStatus)}
                            className={`px-2 py-1 rounded text-xs font-bold border ${
                              order.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" :
                              order.status === "processing" ? "bg-blue-100 text-blue-800 border-blue-200" :
                              order.status === "shipped" ? "bg-purple-100 text-purple-800 border-purple-200" :
                              order.status === "delivered" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                              "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {allOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-brand-muted">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PENDING REVIEW */}
        {activeTab === "pending" && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-1">Pending Review</h1>
            <p className="text-brand-muted mb-6">{pendingProducts.length} items</p>

            {selectedIds.size > 0 && (
              <div className="bg-brand-sage/20 border border-brand-green-700/20 rounded-xl p-4 mb-6 flex items-center justify-between animate-[fadeInUp_0.3s]">
                <div className="font-bold text-brand-green-950">{selectedIds.size} products selected</div>
                <div className="flex gap-2">
                  {!showBulkReject ? (
                    <>
                      <button onClick={handleBulkApprove} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-bold hover:bg-emerald-700 transition">Approve Selected</button>
                      <button onClick={() => setShowBulkReject(true)} className="px-4 py-2 bg-red-100 text-red-600 rounded text-sm font-bold hover:bg-red-200 transition">Reject Selected</button>
                    </>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <input value={bulkRejectReason} onChange={e => setBulkRejectReason(e.target.value)} placeholder="Reject reason..." className="border rounded px-3 py-1.5 text-sm" />
                      <button onClick={handleBulkReject} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold">Confirm</button>
                      <button onClick={() => setShowBulkReject(false)} className="px-3 py-2 text-brand-muted text-sm">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {pendingProducts.map(p => (
                <div key={p.id} className={`bg-white rounded-xl border border-brand-line shadow-sm overflow-hidden flex ${animatingOut === p.id ? "opacity-0 scale-95" : ""}`}>
                  <div className="p-4 flex items-center justify-center bg-gray-50 border-r border-brand-line">
                    <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} className="w-5 h-5 rounded text-brand-green-700" />
                  </div>
                  <div className="w-40 h-40 bg-gray-100 flex-shrink-0">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-image text-3xl text-gray-300"></i></div>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-brand-ink flex items-center gap-2">
                            {p.name}
                            {p.editHistory && p.editHistory.length > 0 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200">✏️ UPDATED LISTING</span>}
                          </h3>
                          <p className="text-sm text-brand-muted">{p.category} • {p.originCountry} • {p.sellerEmail}</p>
                        </div>
                        <div className="text-xs text-brand-muted">Submitted: {new Date(p.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-4 mb-3">
                        <span className="font-bold text-brand-green-700">{p.price} {p.priceUnit}</span>
                        <span className="text-brand-muted text-sm">MOQ: {p.moq}</span>
                      </div>
                      {p.editHistory && p.editHistory.length > 0 && (
                        <div className="mb-3 text-xs bg-yellow-50 p-2 rounded border border-yellow-100">
                          <strong className="text-yellow-800 block mb-1">Recent Changes:</strong>
                          {p.editHistory.map((e, i) => (
                            <div key={i} className="text-yellow-700">{e.field}: {e.oldValue} → {e.newValue}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end gap-4 mt-2">
                      <div className="flex-1">
                        <textarea value={adminNote[p.id] || ""} onChange={e => setAdminNote({...adminNote, [p.id]: e.target.value})} placeholder="Admin Note (internal only)" className="w-full text-xs border border-brand-line rounded p-2 h-10 resize-none focus:ring-1 focus:ring-brand-green-500" />
                      </div>
                      <div className="flex gap-2">
                        {rejectId === p.id ? (
                          <div className="flex gap-2 items-center">
                                  <input 
                                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setRejectReason(e.target.value)} placeholder="Reason" className="border rounded px-2 py-1 text-sm" />
                            <button onClick={() => handleReject(p.id)} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-bold">Reject</button>
                            <button onClick={() => setRejectId(null)} className="px-2 text-brand-muted text-sm">Cancel</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setRejectId(p.id)} className="px-4 py-1.5 text-red-600 bg-red-50 rounded text-sm font-bold hover:bg-red-100 transition">Reject</button>
                            <button onClick={() => handleApprove(p.id)} className="px-4 py-1.5 bg-emerald-600 text-white rounded text-sm font-bold hover:bg-emerald-700 transition">Approve</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pendingProducts.length === 0 && <div className="text-center py-10 text-brand-muted border rounded-xl bg-white">No pending products.</div>}
            </div>
          </div>
        )}

        {/* SECTIONS 3-5: PRODUCTS TABLES */}
        {(activeTab === "approved" || activeTab === "rejected" || activeTab === "all") && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-4 capitalize">{activeTab} Products</h1>
            
            <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl border border-brand-line shadow-sm">
              <input type="text" placeholder="Search name or seller..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm" />
              {activeTab === "all" && (
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)} className="border rounded-lg px-3 py-2 text-sm">
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
                <option value="category">Sort by Category</option>
              </select>
              {activeTab === "all" && <button onClick={exportCSV} className="px-4 py-2 bg-brand-green-950 text-white rounded-lg text-sm font-bold"><i className="fa-solid fa-download mr-2"></i>Export CSV</button>}
            </div>

            <div className="bg-white rounded-xl border border-brand-line shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-brand-line text-left">
                      <th className="px-4 py-3 font-medium">Image</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Seller</th>
                      {activeTab === "all" && <th className="px-4 py-3 font-medium">Status</th>}
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line/50">
                    {getFilteredSortedProducts(activeTab === "approved" ? approvedProducts : activeTab === "rejected" ? rejectedProducts : allProducts).map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><div className="w-10 h-10 rounded overflow-hidden bg-gray-100">{p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover"/>}</div></td>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-brand-muted">{p.category}</td>
                        <td className="px-4 py-3">{p.price} {p.priceUnit}</td>
                        <td className="px-4 py-3 text-brand-muted">{p.sellerEmail}</td>
                        {activeTab === "all" && <td className="px-4 py-3">{statusBadge(p.status)}</td>}
                        <td className="px-4 py-3 text-brand-muted">{new Date(p.updatedAt || p.submittedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          {p.status === "approved" && <button onClick={() => handleRevoke(p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 px-2 py-1 rounded">Revoke</button>}
                          {p.status === "rejected" && <button onClick={() => handleReconsider(p.id)} className="text-blue-500 hover:text-blue-700 text-xs font-bold border border-blue-200 px-2 py-1 rounded">Reconsider</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: SELLERS MANAGEMENT */}
        {activeTab === "sellers" && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-6">Sellers Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sellersList.map(s => (
                <div key={s.email} className="bg-white rounded-xl border border-brand-line p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-brand-ink truncate">{s.email}</div>
                    {s.isActive ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">⛔ DEACTIVATED</span>
                    )}
                  </div>
                  <div className="text-xs text-brand-muted mb-4">Joined: {new Date(s.firstSubmission).toLocaleDateString()}</div>
                  <div className="flex justify-between text-sm mb-4">
                    <div className="text-center"><div className="font-bold">{s.total}</div><div className="text-xs text-brand-muted">Total</div></div>
                    <div className="text-center"><div className="font-bold text-emerald-600">{s.approved}</div><div className="text-xs text-brand-muted">Approved</div></div>
                    <div className="text-center"><div className="font-bold text-amber-600">{s.pending}</div><div className="text-xs text-brand-muted">Pending</div></div>
                    <div className="text-center"><div className="font-bold text-red-500">{s.rejected}</div><div className="text-xs text-brand-muted">Rejected</div></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSellerFilter(s.email); setActiveTab("all"); }} className="flex-1 bg-gray-100 text-brand-ink text-xs font-bold py-2 rounded hover:bg-gray-200 transition">View Products</button>
                    {s.isActive ? (
                      <button onClick={() => handleToggleSeller(s.email, false)} className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2 rounded hover:bg-red-100 transition">Deactivate</button>
                    ) : (
                      <button onClick={() => handleToggleSeller(s.email, true)} className="flex-1 bg-emerald-50 text-emerald-600 text-xs font-bold py-2 rounded hover:bg-emerald-100 transition">Activate</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: ACTIVITY LOG */}
        {activeTab === "activity" && (
          <div>
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-6">Activity Log</h1>
            <div className="flex gap-2 mb-4">
              {["all", "approvals", "rejections", "seller"].map(f => (
                <button key={f} onClick={() => setLogFilter(f as "all" | "approvals" | "rejections" | "seller")} className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${logFilter === f ? "bg-slate-900 text-white" : "bg-gray-200 text-brand-muted hover:bg-gray-300"}`}>{f}</button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-brand-line shadow-sm divide-y divide-brand-line/50">
              {adminLogs.filter(l => logFilter === "all" || (logFilter === "approvals" && l.action === "approved") || (logFilter === "rejections" && l.action === "rejected") || (logFilter === "seller" && l.action.startsWith("seller"))).map(log => (
                <div key={log.id} className="p-4 flex gap-4">
                  <div className="text-2xl mt-1">
                    {log.action === "approved" ? "✅" : log.action === "rejected" ? "❌" : log.action.startsWith("seller") ? "👤" : "📝"}
                  </div>
                  <div>
                    <div className="font-bold text-brand-ink">{log.action.replace("_", " ").toUpperCase()}</div>
                    <div className="text-sm">{log.productName || log.sellerEmail}</div>
                    {log.note && <div className="text-sm text-brand-muted mt-1 bg-gray-50 p-2 rounded border">Note: {log.note}</div>}
                    <div className="text-xs text-brand-muted mt-2">By {log.adminEmail} • {new Date(log.timestamp).toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short"})}</div>
                  </div>
                </div>
              ))}
              {adminLogs.length === 0 && <div className="p-10 text-center text-brand-muted">No admin actions recorded yet</div>}
            </div>
          </div>
        )}

        {/* SECTION 8: ADMIN SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold font-serif text-brand-green-950 mb-6">Admin Settings</h1>
            
            <div className="bg-white rounded-xl border border-brand-line shadow-sm p-6 mb-8 space-y-6">
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={settings.autoApprove} onChange={e => setSettings({...settings, autoApprove: e.target.checked})} className="w-5 h-5 rounded text-brand-green-700" />
                  <span className="font-bold text-brand-ink">Enable Auto-Approve</span>
                </label>
                <p className="text-sm text-brand-muted mt-1 ml-8">If ON, new seller product submissions skip pending and go straight to approved.</p>
              </div>

              <div>
                <label className="block font-bold text-brand-ink mb-2">Welcome Message for Sellers</label>
                <input type="text" value={settings.welcomeMessage} onChange={e => setSettings({...settings, welcomeMessage: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm" placeholder="e.g. Welcome to IGO Marketplace!" />
              </div>

              <div>
                <label className="block font-bold text-brand-ink mb-2">Admin Email</label>
                <input type="text" value={adminEmail || ""} disabled className="w-full border rounded-lg px-4 py-2 text-sm bg-gray-50 text-brand-muted" />
              </div>

              <button onClick={handleSaveSettings} className="px-6 py-2.5 bg-brand-green-950 text-white rounded-lg font-bold hover:bg-brand-green-850 transition">Save Settings</button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600/80 mb-4">Resetting all product data cannot be undone. This clears pending products, approved products, and activity logs.</p>
              {!showResetModal ? (
                <button onClick={() => setShowResetModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Reset All Product Data</button>
              ) : (
                <div className="flex gap-2 items-center">
                  <input value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="Type RESET to confirm" className="border border-red-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500" />
                  <button onClick={handleResetData} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">Confirm</button>
                  <button onClick={() => setShowResetModal(false)} className="px-3 py-2 text-red-800 text-sm">Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
