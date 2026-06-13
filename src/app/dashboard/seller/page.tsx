"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { SellerProduct } from "@/types/product";
import { PRODUCT_CATEGORIES, PRICE_UNITS } from "@/types/product";
import {
  getProductsBySellerEmail,
  isSellerActive,
  getAdminSettings,
  addProduct,
  updateProduct,
} from "@/lib/productService";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isActive, setIsActive] = useState(true);
  const [adminSettings, setAdminSettings] = useState({ autoApprove: false, welcomeMessage: "" });
  
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadData = useCallback(async () => {
    if (!email) return;
    const active = await isSellerActive(email);
    setIsActive(active);
    const sets = await getAdminSettings();
    setAdminSettings(sets);
    
    const prod = await getProductsBySellerEmail(email);
    const formatted = prod.map(p => ({
      ...p,
      submittedAt: typeof p.submittedAt === "object" && p.submittedAt !== null && "toDate" in p.submittedAt ? p.submittedAt.toDate().toISOString() : String(p.submittedAt || new Date().toISOString()),
      updatedAt: typeof p.updatedAt === "object" && p.updatedAt !== null && "toDate" in p.updatedAt ? p.updatedAt.toDate().toISOString() : String(p.updatedAt || new Date().toISOString()),
    })) as SellerProduct[];
    
    setProducts(formatted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  }, [email]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || role !== "seller")) {
      router.push("/login/seller");
    }
  }, [mounted, isAuthenticated, role, router]);

  useEffect(() => {
    if (mounted && role === "seller") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [mounted, role, loadData]);

  if (!mounted || role !== "seller") return null;

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl">
            <i className="fa-solid fa-user-slash"></i>
          </div>
          <h1 className="text-2xl font-bold text-brand-ink mb-2">Account Deactivated</h1>
          <p className="text-brand-muted mb-8">Your seller account has been deactivated by an administrator. Please contact support for more information.</p>
          <button onClick={() => { logout(); router.push("/"); }} className="w-full bg-brand-green-950 text-white font-bold py-3 rounded-xl hover:bg-brand-green-850 transition">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    total: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleEditClick = (product: SellerProduct) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      priceUnit: product.priceUnit,
      description: product.description,
      imageUrl: product.imageUrl,
      moq: product.moq,
      originCountry: product.originCountry,
    });
    setEditingId(product.id);
    setActiveTab("add");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const active = await isSellerActive(email);
    if (!active) {
      showToastMsg("Error: Account deactivated");
      return;
    }

    const now = new Date().toISOString();

    if (editingId) {
      // Edit mode
      const oldP = products.find(p => p.id === editingId);
      if (oldP) {
        const editHistory = oldP.editHistory || [];
        const priceHistory = oldP.priceHistory || [];
        
        let fieldsChanged = false;
        
        // Check fields
        (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
          if (oldP[key] !== formData[key]) {
            editHistory.push({
              field: key,
              oldValue: String(oldP[key] || ""),
              newValue: String(formData[key] || ""),
              changedAt: now
            });
            fieldsChanged = true;
          }
        });

        if (oldP.price !== formData.price || oldP.priceUnit !== formData.priceUnit) {
          priceHistory.unshift({
            price: formData.price,
            priceUnit: formData.priceUnit,
            changedAt: now,
            changedBy: email
          });
        }

        if (fieldsChanged || oldP.status === "rejected") {
          await updateProduct(editingId, {
            ...formData,
            status: "pending",
            editHistory,
            priceHistory
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
          showToastMsg("Changes submitted for admin re-approval");
        } else {
          showToastMsg("No changes detected");
        }
      }
    } else {
      // Add mode
      const isAuto = adminSettings.autoApprove;
      await addProduct({
        ...formData,
        sellerEmail: email,
        status: isAuto ? "approved" : "pending",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      showToastMsg(isAuto ? "Product automatically approved!" : "Product submitted for admin approval!");
    }

    setFormData(defaultFormData);
    setEditingId(null);
    await loadData();
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
    { key: "add", label: editingId ? "Edit Product" : "Add Product", icon: editingId ? "fa-pen" : "fa-plus-circle" },
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
              onClick={() => {
                if (item.key === "add" && !editingId) setFormData(defaultFormData);
                setActiveTab(item.key);
              }}
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
            onClick={() => { logout(); router.push("/"); }}
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
              onClick={() => {
                if (item.key === "add" && !editingId) setFormData(defaultFormData);
                setActiveTab(item.key);
              }}
              className={`p-2 rounded-lg text-xs ${activeTab === item.key ? "bg-white/15" : "text-white/60"}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
            </button>
          ))}
          <button onClick={() => { logout(); router.push("/"); }} className="p-2 rounded-lg text-xs text-red-300">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
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
            {adminSettings.welcomeMessage && (
              <div className="bg-brand-sage/50 border border-brand-green-700/20 text-brand-green-950 p-4 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
                <i className="fa-solid fa-bullhorn text-brand-green-700"></i>
                <span className="font-medium">{adminSettings.welcomeMessage}</span>
              </div>
            )}
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
                <div key={stat.label} className="bg-white rounded-xl p-5 border border-brand-line shadow-sm">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
                  </div>
                  <div className="text-2xl font-bold text-brand-ink">{stat.value}</div>
                  <div className="text-xs text-brand-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-brand-line shadow-sm">
              <div className="p-5 border-b border-brand-line flex justify-between items-center">
                <h2 className="font-bold text-brand-ink">Recent Submissions</h2>
                <button onClick={() => setActiveTab("products")} className="text-sm text-brand-blue hover:underline">View All →</button>
              </div>
              {products.length === 0 ? (
                <div className="p-10 text-center text-brand-muted">
                  <i className="fa-solid fa-inbox text-4xl mb-3 text-brand-line"></i>
                  <p className="font-medium">No products yet</p>
                  <button onClick={() => { setEditingId(null); setFormData(defaultFormData); setActiveTab("add"); }} className="mt-4 px-4 py-2 bg-brand-green-700 text-white rounded-lg text-sm font-bold hover:bg-brand-green-850 transition">
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
                        <tr key={p.id} className="border-b border-brand-line/50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-brand-ink">{p.name}</td>
                          <td className="px-5 py-3 text-brand-muted">{p.category}</td>
                          <td className="px-5 py-3 text-brand-ink">{p.price} {p.priceUnit}</td>
                          <td className="px-5 py-3">{statusBadge(p.status)}</td>
                          <td className="px-5 py-3 text-brand-muted">{new Date(p.submittedAt).toLocaleDateString()}</td>
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
                onClick={() => { setEditingId(null); setFormData(defaultFormData); setActiveTab("add"); }}
                className="px-4 py-2.5 bg-brand-green-700 text-white rounded-lg text-sm font-bold hover:bg-brand-green-850 transition-all shadow-sm"
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
                  onClick={() => { setEditingId(null); setFormData(defaultFormData); setActiveTab("add"); }}
                  className="px-6 py-3 bg-brand-green-700 text-white rounded-lg font-bold hover:bg-brand-green-850 transition"
                >
                  <i className="fa-solid fa-plus mr-2"></i>Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-brand-line shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="h-44 bg-gray-100 relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-line">
                          <i className="fa-solid fa-image text-4xl"></i>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">{statusBadge(p.status)}</div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-brand-ink text-lg mb-1">{p.name}</h3>
                      <p className="text-sm text-brand-muted mb-3">{p.category} • {p.originCountry}</p>

                      <div className="flex justify-between items-center mb-4">
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
                        <div className="mt-auto mb-4 bg-red-50 border border-red-100 rounded-lg p-2 text-xs text-red-600">
                          <i className="fa-solid fa-info-circle mr-1"></i>
                          Reason: {p.rejectionReason}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-brand-line flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[11px] text-brand-muted">
                          <span title="Submitted Date"><i className="fa-regular fa-calendar mr-1"></i>Submitted {new Date(p.submittedAt).toLocaleDateString()}</span>
                          {p.updatedAt && (p.status === "approved" || p.status === "rejected") && (
                            <span title="Reviewed Date"><i className="fa-solid fa-clock-rotate-left mr-1"></i>Reviewed {new Date(p.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(p)} className="flex-1 px-3 py-1.5 bg-gray-100 text-brand-ink text-sm font-bold rounded hover:bg-gray-200 transition">
                            <i className="fa-solid fa-pen mr-1"></i>Edit
                          </button>
                          {p.status === "rejected" && (
                            <button onClick={() => handleEditClick(p)} className="flex-1 px-3 py-1.5 bg-brand-green-700 text-white text-sm font-bold rounded hover:bg-brand-green-850 transition">
                              <i className="fa-solid fa-rotate-right mr-1"></i>Resubmit
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

        {/* ADD / EDIT PRODUCT TAB */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">{editingId ? "Edit Product" : "Add New Product"}</h1>
              <p className="text-brand-muted mt-1">{editingId ? "Update the details and resubmit." : "Fill in the details to submit for admin approval."}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-brand-line shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Product Name *</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Category *</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/30">
                    {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Price *</label>
                  <div className="flex gap-2">
                    <input name="price" type="text" required value={formData.price} onChange={handleChange} className="flex-1 border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
                    <select name="priceUnit" value={formData.priceUnit} onChange={handleChange} className="w-28 border border-brand-line rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-500/30">
                      {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Description *</label>
                <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-ink mb-1.5">Image URL</label>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Minimum Order Qty (MOQ) *</label>
                  <input name="moq" required value={formData.moq} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-ink mb-1.5">Origin Country *</label>
                  <input name="originCountry" required value={formData.originCountry} onChange={handleChange} className="w-full border border-brand-line rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500/30" />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button type="submit" className="flex-1 bg-brand-green-700 text-white font-bold py-3 rounded-lg hover:bg-brand-green-850 transition-all shadow-sm active:scale-[0.98]">
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  {editingId ? "Submit Changes" : "Submit for Approval"}
                </button>
                <button type="button" onClick={() => { setFormData(defaultFormData); setEditingId(null); setActiveTab("products"); }} className="px-6 py-3 bg-gray-100 text-brand-muted font-bold rounded-lg hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
