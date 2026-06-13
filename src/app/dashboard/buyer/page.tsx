/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 flex gap-8">
        
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white border border-brand-line rounded-lg overflow-hidden">
            <div className="p-4 bg-brand-green-950 text-white">
              <h3 className="font-bold">Buyer Dashboard</h3>
              <span className="text-xs text-white/70">ACME Imports Ltd.</span>
            </div>
            <nav className="p-2 space-y-1">
              <Link href="#" className="block px-4 py-2 bg-brand-sage text-brand-green-950 font-medium rounded">Overview</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded">My RFQs</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded">Inquiries & Quotes</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded">Saved Products</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-brand-sage/50 rounded">Shipment Tracking</Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Overview</h1>
              <p className="text-brand-muted">Welcome back! Here's the status of your import inquiries.</p>
            </div>
            <Link href="/rfq" className="px-4 py-2 bg-white text-brand-ink font-bold rounded shadow hover:bg-gray-100">
              <i className="fa-solid fa-plus mr-2"></i>New RFQ
            </Link>
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

