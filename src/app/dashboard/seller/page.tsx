"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SellerProduct } from "@/types/product";
import { PRODUCT_CATEGORIES, PRICE_UNITS, STORAGE_KEYS } from "@/types/product";

type Tab = "overview" | "products" | "add";

const defaultFormData = {
  name: "",
  category: PRODUCT_CATEGORIES[0] as string,
  price: "",
  priceUnit: PRICE_UNITS[0] as string,
  description: "",
  imageUrl: "",
  moq: "",
  originCountry: "",
};

export default function SellerDashboard() {
  const router = useRouter();
  const { role, email, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadProducts = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PENDING_PRODUCTS);
      const all: SellerProduct[] = raw ? JSON.parse(raw) : [];
      setProducts(all.filter((p) => p.sellerEmail === email));
    } catch {
      setProducts([]);
    }
  }, [email]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || role !== "seller")) {
      router.push("/login?role=seller");
    }
  }, [mounted, isAuthenticated, role, router]);

  useEffect(() => {
    if (email) loadProducts();
  }, [email, loadProducts]);

  if (!mounted || role !== "seller") return null;

  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: SellerProduct = {
      id: Date.now().toString(),
      sellerEmail: email || "unknown@seller.com",
      submittedAt: new Date().toISOString(),
      status: "pending",
      ...formData,
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PENDING_PRODUCTS);
      const all: SellerProduct[] = raw ? JSON.parse(raw) : [];
      all.push(newProduct);
      localStorage.setItem(STORAGE_KEYS.PENDING_PRODUCTS, JSON.stringify(all));
    } catch {
      // storage full fallback
    }

    setFormData(defaultFormData);
    loadProducts();
    setToast("Product submitted for admin approval!");
    setTimeout(() => setToast(null), 4000);
    setActiveTab("products");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    { key: "overview", label: "Overview", icon: "fa-chart-line" },
    { key: "products", label: "My Products", icon: "fa-boxes-stacked", badge: stats.total },
    { key: "add", label: "Add Product", icon: "fa-plus-circle" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-green-950 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-amber flex items-center justify-center text-brand-ink font-bold">
              <i className="fa-solid fa-store"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Seller Dashboard</h3>
              <p className="text-xs text-white/50 truncate max-w-[140px]">{email}</p>
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
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-brand-green-950 text-white z-40 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-sm">Seller Dashboard</span>
        <div className="flex gap-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`p-2 rounded-lg text-xs ${activeTab === item.key ? "bg-white/15" : "text-white/60"}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
            </button>
          ))}
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="p-2 rounded-lg text-xs text-red-300"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]">
            <i className="fa-solid fa-circle-check text-lg"></i>
            <span className="font-medium text-sm">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Overview</h1>
              <p className="text-brand-muted mt-1">Welcome back! Here&apos;s your product summary.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: stats.total, icon: "fa-boxes-stacked", color: "text-brand-blue", bg: "bg-blue-50" },
                { label: "Pending Approval", value: stats.pending, icon: "fa-clock", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Approved", value: stats.approved, icon: "fa-circle-check", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Rejected", value: stats.rejected, icon: "fa-circle-xmark", color: "text-red-500", bg: "bg-red-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-brand-line shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
                  </div>
                  <div className="text-2xl font-bold text-brand-ink">{stat.value}</div>
                  <div className="text-xs text-brand-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl border border-brand-line shadow-sm">
              <div className="p-5 border-b border-brand-line flex justify-between items-center">
                <h2 className="font-bold text-brand-ink">Recent Submissions</h2>
                <button
                  onClick={() => setActiveTab("products")}
                  className="text-sm text-brand-blue hover:underline"
                >
                  View All →
                </button>
              </div>
              {products.length === 0 ? (
                <div className="p-10 text-center text-brand-muted">
                  <i className="fa-solid fa-inbox text-4xl mb-3 text-brand-line"></i>
                  <p className="font-medium">No products yet</p>
                  <p className="text-sm mt-1">Start by adding your first product</p>
                  <button
                    onClick={() => setActiveTab("add")}
                    className="mt-4 px-4 py-2 bg-brand-green-700 text-white rounded-lg text-sm font-bold hover:bg-brand-green-850 transition"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>Add Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-brand-muted border-b border-brand-line">
                        <th className="px-5 py-3 font-medium">Product</th>
                        <th className="px-5 py-3 font-medium">Category</th>
                        <th className="px-5 py-3 font-medium">Price</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((p) => (
                        <tr key={p.id} className="border-b border-brand-line/50 hover:bg-gray-50 transition">
                          <td className="px-5 py-3 font-medium text-brand-ink">{p.name}</td>
                          <td className="px-5 py-3 text-brand-muted">{p.category}</td>
                          <td className="px-5 py-3 text-brand-ink">{p.price} {p.priceUnit}</td>
                          <td className="px-5 py-3">{statusBadge(p.status)}</td>
                          <td className="px-5 py-3 text-brand-muted">
                            {new Date(p.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold font-serif text-brand-green-950">My Products</h1>
                <p className="text-brand-muted mt-1">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
              </div>
              <button
                onClick={() => setActiveTab("add")}
                className="px-4 py-2.5 bg-brand-green-700 text-white rounded-lg text-sm font-bold hover:bg-brand-green-850 transition-all shadow-sm hover:shadow-md"
              >
                <i className="fa-solid fa-plus mr-2"></i>Add New
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-line p-16 text-center">
                <i className="fa-solid fa-box-open text-6xl text-brand-line mb-4"></i>
                <h3 className="text-xl font-bold text-brand-ink mb-2">No products yet</h3>
                <p className="text-brand-muted mb-6">Start listing your products to reach global buyers</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="px-6 py-3 bg-brand-green-700 text-white rounded-lg font-bold hover:bg-brand-green-850 transition"
                >
                  <i className="fa-solid fa-plus mr-2"></i>Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-brand-line shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-line">
                          <i className="fa-solid fa-image text-4xl"></i>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">{statusBadge(p.status)}</div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-brand-ink text-lg mb-1 group-hover:text-brand-green-700 transition">
                        {p.name}
                      </h3>
                      <p className="text-sm text-brand-muted mb-3">{p.category} • {p.originCountry}</p>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-brand-green-700">{p.price}</span>
                          <span className="text-xs text-brand-muted ml-1">{p.priceUnit}</span>
                        </div>
                        <div className="bg-brand-sage px-3 py-1.5 rounded-md">
                          <span className="text-xs text-brand-muted">MOQ: </span>
                          <span className="text-xs font-bold text-brand-green-950">{p.moq}</span>
                        </div>
                      </div>

                      {p.status === "rejected" && p.rejectionReason && (
                        <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2 text-xs text-red-600">
                          <i className="fa-solid fa-info-circle mr-1"></i>
                          Reason: {p.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Add New Product</h1>
              <p className="text-brand-muted mt-1">Fill in the details to submit for admin approval.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-brand-line shadow-sm p-6 md:p-8 space-y-5"
            >
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Product Name *</label>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition"
                  placeholder="e.g., Premium Basmati Rice 1121"
                />
              </div>

              {/* Category & Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition bg-white"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Price *</label>
                  <div className="flex gap-2">
                    <input
                      name="price"
                      type="text"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="flex-1 border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition"
                      placeholder="e.g., $850"
                    />
                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      className="w-28 border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition bg-white"
                    >
                      {PRICE_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition resize-none"
                  placeholder="Describe your product quality, specifications, packaging..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Image URL</label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition"
                  placeholder="https://example.com/product-image.jpg"
                />
              </div>

              {/* MOQ & Origin Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Minimum Order Qty (MOQ) *</label>
                  <input
                    name="moq"
                    required
                    value={formData.moq}
                    onChange={handleChange}
                    className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition"
                    placeholder="e.g., 10 MT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Origin Country *</label>
                  <input
                    name="originCountry"
                    required
                    value={formData.originCountry}
                    onChange={handleChange}
                    className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30 focus:border-brand-green-500 transition"
                    placeholder="e.g., India"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-brand-green-700 text-white font-bold py-3 rounded-lg hover:bg-brand-green-850 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  Submit for Approval
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(defaultFormData)}
                  className="px-6 py-3 bg-gray-100 text-brand-muted font-bold rounded-lg hover:bg-gray-200 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
