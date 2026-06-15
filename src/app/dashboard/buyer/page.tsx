"use client";
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrdersByCustomerEmail, Order } from "@/lib/orderService";

export default function BuyerDashboard() {
  const router = useRouter();
  const { role, email, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "orders">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.location.hash === "#orders") {
      setActiveTab("orders");
    }
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || role !== "buyer")) {
      router.push("/login/buyer");
    }
  }, [mounted, isLoading, isAuthenticated, role, router]);

  useEffect(() => {
    if (mounted && email) {
      setLoadingOrders(true);
      getOrdersByCustomerEmail(email)
        .then((data) => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoadingOrders(false);
        });
    }
  }, [mounted, email]);

  if (!mounted || isLoading || role !== "buyer") {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-brand-line rounded-lg overflow-hidden">
            <div className="p-4 bg-brand-green-950 text-white">
              <h3 className="font-bold">Buyer Dashboard</h3>
              <span className="text-xs text-white/70 block truncate" title={email || ""}>{email || "Buyer Account"}</span>
            </div>
            <nav className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab("overview")} 
                className={`w-full text-left block px-4 py-2 font-medium rounded transition ${activeTab === "overview" ? "bg-brand-sage text-brand-green-950" : "text-brand-muted hover:bg-brand-sage/50"}`}
              >
                Overview
              </button>
              <Link href="/hub/agriculture" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-shop mr-2 w-4"></i>Browse Catalog</Link>
              <Link href="/checkout" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-cart-shopping mr-2 w-4"></i>My Cart</Link>
              <button 
                onClick={() => { setActiveTab("orders"); window.location.hash = "orders"; }} 
                className={`w-full text-left block px-4 py-2 font-medium rounded transition ${activeTab === "orders" ? "bg-brand-sage text-brand-green-950" : "text-brand-muted hover:bg-brand-sage/50"}`}
              >
                <i className="fa-solid fa-truck-fast mr-2 w-4"></i>Order Tracking
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">
                {activeTab === "overview" ? "Overview" : "Order Tracking"}
              </h1>
              <p className="text-brand-muted">
                {activeTab === "overview" ? "Welcome back! Here's the status of your import inquiries." : "Track your recent orders and quotes."}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/hub/agriculture" className="px-4 py-2 bg-brand-green-700 text-white font-bold rounded shadow hover:bg-brand-green-850 transition whitespace-nowrap text-sm flex items-center">
                <i className="fa-solid fa-shop mr-2"></i>Catalog
              </Link>
            </div>
          </div>

          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
                  <div className="text-sm text-brand-muted mb-1">Active Quotes</div>
                  <div className="text-3xl font-bold text-brand-green-950">0</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
                  <div className="text-sm text-brand-muted mb-1">Pending Orders</div>
                  <div className="text-3xl font-bold text-brand-green-950">{orders.filter(o => o.status === 'pending').length || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
                  <div className="text-sm text-brand-muted mb-1">Active Shipments</div>
                  <div className="text-3xl font-bold text-brand-green-950">{orders.filter(o => o.status === 'shipped').length || 0}</div>
                </div>
              </div>

              <div className="bg-white border border-brand-line rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-brand-line font-bold text-brand-ink flex justify-between items-center bg-gray-50">
                  Recent Orders
                  <button onClick={() => { setActiveTab("orders"); window.location.hash = "orders"; }} className="text-sm text-brand-green-600 hover:underline font-semibold">View All</button>
                </div>
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-brand-muted">
                    <i className="fa-solid fa-box-open text-4xl mb-3 text-brand-line"></i>
                    <p>You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-line">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="font-bold text-brand-ink">Order #{order.id?.slice(-6) || "N/A"}</div>
                          <div className="text-xs text-brand-muted">Placed: {order.createdAt ? new Date(order.createdAt as string).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="bg-white border border-brand-line rounded-lg shadow-sm overflow-hidden">
              {loadingOrders ? (
                <div className="p-8 text-center text-brand-muted">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-brand-muted">
                  <i className="fa-solid fa-box-open text-4xl mb-3 text-brand-line"></i>
                  <p>You haven't placed any orders yet.</p>
                  <Link href="/hub/agriculture" className="text-brand-green-600 font-bold hover:underline mt-4 inline-block">Browse Catalog</Link>
                </div>
              ) : (
                <div className="divide-y divide-brand-line">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-brand-ink text-lg">Order #{order.id?.slice(-6) || "N/A"}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-brand-muted">
                            Placed on: {order.createdAt ? new Date(order.createdAt as string).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4">
                        <h4 className="text-sm font-bold text-brand-ink mb-2">Items Ordered:</h4>
                        <ul className="space-y-1 text-sm text-brand-muted">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.productName}</span>
                              <span>Quote on Request</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-sm text-brand-muted border-t border-gray-100 pt-3">
                        <span className="font-semibold text-brand-ink">Shipping To:</span> {order.shippingAddress || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
