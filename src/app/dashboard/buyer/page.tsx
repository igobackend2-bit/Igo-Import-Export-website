"use client";
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function BuyerDashboard() {
  const router = useRouter();
  const { role, email, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || role !== "buyer")) {
      router.push("/login/buyer");
    }
  }, [mounted, isLoading, isAuthenticated, role, router]);

  if (!mounted || isLoading || role !== "buyer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      {/* Navbar is already rendered by RootLayout, removing duplicate here */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-brand-line rounded-lg overflow-hidden">
            <div className="p-4 bg-brand-green-950 text-white">
              <h3 className="font-bold">Buyer Dashboard</h3>
              <span className="text-xs text-white/70 block truncate" title={email || ""}>{email || "Buyer Account"}</span>
            </div>
            <nav className="p-2 space-y-1">
              <Link href="/dashboard/buyer" className="block px-4 py-2 bg-brand-sage text-brand-green-950 font-medium rounded">Overview</Link>
              <Link href="/hub/agriculture" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-shop mr-2 w-4"></i>Browse Catalog</Link>
              <Link href="/checkout" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-cart-shopping mr-2 w-4"></i>My Cart</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-file-invoice mr-2 w-4"></i>My RFQs</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded transition"><i className="fa-solid fa-truck-fast mr-2 w-4"></i>Shipment Tracking</Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Overview</h1>
              <p className="text-brand-muted">Welcome back! Here's the status of your import inquiries.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/hub/agriculture" className="px-4 py-2 bg-brand-green-700 text-white font-bold rounded shadow hover:bg-brand-green-850 transition whitespace-nowrap text-sm flex items-center">
                <i className="fa-solid fa-shop mr-2"></i>Catalog
              </Link>
              <Link href="/#rfq" className="px-4 py-2 bg-white text-brand-ink font-bold border border-brand-line rounded shadow-sm hover:bg-gray-50 transition whitespace-nowrap text-sm flex items-center">
                <i className="fa-solid fa-plus mr-2"></i>New RFQ
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Active RFQs</div>
              <div className="text-3xl font-bold text-brand-green-950">3</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Quotes Received</div>
              <div className="text-3xl font-bold text-brand-green-950">12</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Active Shipments</div>
              <div className="text-3xl font-bold text-brand-green-950">1</div>
            </div>
          </div>

          <div className="bg-white border border-brand-line rounded-lg shadow-sm">
            <div className="p-4 border-b border-brand-line font-bold text-brand-ink">Recent Quotes</div>
            <div className="p-8 text-center text-brand-muted">
              <i className="fa-solid fa-file-invoice text-4xl mb-3 text-brand-line"></i>
              <p>No new quotes for your active RFQs.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
