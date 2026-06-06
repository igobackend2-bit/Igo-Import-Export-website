"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SellerProduct } from "@/types/product";
import { STORAGE_KEYS } from "@/types/product";

type Tab = "overview" | "pending" | "all";
type SortBy = "date" | "status" | "category";
type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboard() {
  const router = useRouter();
  const { role, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [allProducts, setAllProducts] = useState<SellerProduct[]>([]);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animatingOut, setAnimatingOut] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const loadProducts = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PENDING_PRODUCTS);
      setAllProducts(raw ? JSON.parse(raw) : []);
    } catch {
      setAllProducts([]);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || role !== "admin")) {
      router.push("/login?role=admin");
    }
  }, [mounted, isAuthenticated, role, router]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (!mounted || role !== "admin") return null;

  const pendingProducts = allProducts.filter((p) => p.status === "pending");
  const stats = {
    total: allProducts.length,
    pending: pendingProducts.length,
    approved: allProducts.filter((p) => p.status === "approved").length,
    rejected: allProducts.filter((p) => p.status === "rejected").length,
  };

  const saveProducts = (updated: SellerProduct[]) => {
    localStorage.setItem(STORAGE_KEYS.PENDING_PRODUCTS, JSON.stringify(updated));

    // Also update approved products list
    const approved = updated.filter((p) => p.status === "approved");
    localStorage.setItem(STORAGE_KEYS.APPROVED_PRODUCTS, JSON.stringify(approved));
  };

  const handleApprove = (id: string) => {
    setAnimatingOut(id);
    setTimeout(() => {
      const updated = allProducts.map((p) =>
        p.id === id ? { ...p, status: "approved" as const } : p
      );
      saveProducts(updated);
      setAllProducts(updated);
      setAnimatingOut(null);
      showToast("Product approved successfully!");
    }, 400);
  };

  const handleReject = (id: string) => {
    setAnimatingOut(id);
    setTimeout(() => {
      const updated = allProducts.map((p) =>
        p.id === id
          ? { ...p, status: "rejected" as const, rejectionReason: rejectReason || undefined }
          : p
      );
      saveProducts(updated);
      setAllProducts(updated);
      setRejectId(null);
      setRejectReason("");
      setAnimatingOut(null);
      showToast("Product rejected.");
    }, 400);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const getFilteredSortedProducts = () => {
    let filtered = [...allProducts];
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
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
    { key: "pending", label: "Pending Products", icon: "fa-clock", badge: stats.pending },
    { key: "all", label: "All Products", icon: "fa-table-list" },
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
              <h3 className="font-bold text-sm leading-tight">Admin Panel</h3>
              <p className="text-xs text-white/40">IGO Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
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

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white z-40 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-sm">Admin Panel</span>
        <div className="flex gap-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`p-2 rounded-lg text-xs relative ${activeTab === item.key ? "bg-white/15" : "text-white/50"}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button onClick={() => { logout(); router.push("/"); }} className="p-2 rounded-lg text-xs text-red-400">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]">
            <i className="fa-solid fa-circle-check text-brand-amber text-lg"></i>
            <span className="font-medium text-sm">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Admin Dashboard</h1>
              <p className="text-brand-muted mt-1">Platform product management overview.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Submissions", value: stats.total, icon: "fa-layer-group", color: "text-brand-blue", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Pending Review", value: stats.pending, icon: "fa-hourglass-half", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                { label: "Approved", value: stats.approved, icon: "fa-circle-check", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Rejected", value: stats.rejected, icon: "fa-ban", color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
              ].map((s) => (
                <div key={s.label} className={`bg-white rounded-xl p-5 border ${s.border} shadow-sm hover:shadow-md transition-shadow`}>
                  <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <i className={`fa-solid ${s.icon} ${s.color}`}></i>
                  </div>
                  <div className="text-3xl font-bold text-brand-ink">{s.value}</div>
                  <div className="text-xs text-brand-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-brand-line shadow-sm">
              <div className="p-5 border-b border-brand-line flex justify-between items-center">
                <h2 className="font-bold text-brand-ink">Recent Activity</h2>
                {stats.pending > 0 && (
                  <button onClick={() => setActiveTab("pending")} className="text-sm text-brand-amber font-bold hover:underline">
                    {stats.pending} pending →
                  </button>
                )}
              </div>
              {allProducts.length === 0 ? (
                <div className="p-10 text-center text-brand-muted">
                  <i className="fa-solid fa-inbox text-4xl mb-3 text-brand-line"></i>
                  <p className="font-medium">No submissions yet</p>
                  <p className="text-sm mt-1">Products submitted by sellers will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-brand-line/50">
                  {allProducts
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .slice(0, 8)
                    .map((p) => (
                      <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <i className="fa-solid fa-box text-brand-muted text-sm"></i>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-brand-ink">{p.name}</span>
                            <div className="text-xs text-brand-muted">
                              {p.sellerEmail} • {new Date(p.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {statusBadge(p.status)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PENDING PRODUCTS */}
        {activeTab === "pending" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Pending Products</h1>
              <p className="text-brand-muted mt-1">{pendingProducts.length} product{pendingProducts.length !== 1 ? "s" : ""} awaiting review</p>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-line p-16 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-check-double text-3xl text-emerald-500"></i>
                </div>
                <h3 className="text-xl font-bold text-brand-ink mb-2">All caught up!</h3>
                <p className="text-brand-muted">There are no pending products to review right now.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {pendingProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border border-brand-line shadow-sm overflow-hidden transition-all duration-400 ${
                      animatingOut === p.id ? "opacity-0 scale-95 translate-x-8" : "opacity-100"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0 overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-line">
                            <i className="fa-solid fa-image text-4xl"></i>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-brand-ink">{p.name}</h3>
                            <div className="flex gap-3 text-sm text-brand-muted mt-1">
                              <span><i className="fa-solid fa-tag mr-1"></i>{p.category}</span>
                              <span><i className="fa-solid fa-location-dot mr-1"></i>{p.originCountry}</span>
                            </div>
                          </div>
                          {statusBadge(p.status)}
                        </div>

                        <p className="text-sm text-brand-muted mb-4 line-clamp-2">{p.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="text-xs text-brand-muted">Price</div>
                            <div className="text-sm font-bold text-brand-ink">{p.price} {p.priceUnit}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="text-xs text-brand-muted">MOQ</div>
                            <div className="text-sm font-bold text-brand-ink">{p.moq}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="text-xs text-brand-muted">Seller</div>
                            <div className="text-sm font-bold text-brand-ink truncate">{p.sellerEmail}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="text-xs text-brand-muted">Submitted</div>
                            <div className="text-sm font-bold text-brand-ink">
                              {new Date(p.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 items-center">
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                          >
                            <i className="fa-solid fa-check mr-2"></i>Approve
                          </button>

                          {rejectId === p.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                              <input
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason (optional)"
                                className="flex-1 border border-brand-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                              />
                              <button
                                onClick={() => handleReject(p.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition active:scale-95"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => { setRejectId(null); setRejectReason(""); }}
                                className="px-3 py-2 text-brand-muted hover:text-brand-ink text-sm transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRejectId(p.id)}
                              className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
                            >
                              <i className="fa-solid fa-xmark mr-2"></i>Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL PRODUCTS */}
        {activeTab === "all" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold font-serif text-brand-green-950">All Products</h1>
                <p className="text-brand-muted mt-1">{allProducts.length} total submission{allProducts.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="border border-brand-line rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/30"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="border border-brand-line rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/30"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
            </div>

            {allProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-line p-16 text-center">
                <i className="fa-solid fa-database text-4xl text-brand-line mb-4"></i>
                <h3 className="text-xl font-bold text-brand-ink mb-2">No products</h3>
                <p className="text-brand-muted">Products will appear here once sellers submit them.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-brand-line shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-gray-50 text-brand-muted border-b border-brand-line">
                        <th className="px-5 py-3.5 font-medium">Product</th>
                        <th className="px-5 py-3.5 font-medium">Category</th>
                        <th className="px-5 py-3.5 font-medium">Price</th>
                        <th className="px-5 py-3.5 font-medium">Seller</th>
                        <th className="px-5 py-3.5 font-medium">Status</th>
                        <th className="px-5 py-3.5 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredSortedProducts().map((p) => (
                        <tr key={p.id} className="border-b border-brand-line/50 hover:bg-gray-50 transition">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <i className="fa-solid fa-box text-brand-muted text-xs"></i>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-brand-ink">{p.name}</div>
                                <div className="text-xs text-brand-muted">{p.originCountry}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-brand-muted">{p.category}</td>
                          <td className="px-5 py-3.5 text-brand-ink font-medium">{p.price} {p.priceUnit}</td>
                          <td className="px-5 py-3.5 text-brand-muted text-xs">{p.sellerEmail}</td>
                          <td className="px-5 py-3.5">{statusBadge(p.status)}</td>
                          <td className="px-5 py-3.5 text-brand-muted text-xs">
                            {new Date(p.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
