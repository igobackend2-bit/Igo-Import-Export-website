import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 flex gap-8">
        
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white border border-brand-line rounded-lg overflow-hidden">
            <div className="p-4 bg-brand-blue text-white">
              <h3 className="font-bold">Seller Dashboard</h3>
              <span className="text-xs text-white/70">Global Agri Exporters</span>
            </div>
            <nav className="p-2 space-y-1">
              <Link href="#" className="block px-4 py-2 bg-blue-50 text-brand-blue font-medium rounded">Overview</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-gray-50 rounded">My Products</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-gray-50 rounded">Buyer Inquiries</Link>
              <Link href="#" className="block px-4 py-2 text-brand-muted hover:bg-gray-50 rounded">Certifications</Link>
              <Link href="#" className="block px-4 py-2 text-brand-amber font-medium hover:bg-gray-50 rounded">Premium Upgrade</Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-brand-green-950">Overview</h1>
              <p className="text-brand-muted">Manage your product catalog and respond to global buyers.</p>
            </div>
            <Link href="#" className="px-4 py-2 bg-brand-blue text-white font-bold rounded shadow hover:bg-blue-700">
              <i className="fa-solid fa-plus mr-2"></i>Add Product
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Active Products</div>
              <div className="text-3xl font-bold text-brand-blue">24</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Pending Inquiries</div>
              <div className="text-3xl font-bold text-brand-coral">5</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-brand-line shadow-sm">
              <div className="text-sm text-brand-muted mb-1">Profile Views</div>
              <div className="text-3xl font-bold text-brand-blue">142</div>
            </div>
          </div>

          <div className="bg-white border border-brand-line rounded-lg shadow-sm">
            <div className="p-4 border-b border-brand-line flex justify-between items-center">
              <span className="font-bold text-brand-ink">Recent Buyer Inquiries</span>
              <span className="text-xs bg-brand-coral/10 text-brand-coral px-2 py-1 rounded">5 Action Required</span>
            </div>
            <div className="p-4 text-sm">
              <div className="flex justify-between py-3 border-b border-brand-line">
                <div>
                  <strong className="block text-brand-ink">RFQ: 50 MT Basmati Rice (FOB)</strong>
                  <span className="text-brand-muted">Buyer from UAE • Posted 2 hours ago</span>
                </div>
                <button className="px-3 py-1 bg-brand-sage text-brand-green-850 rounded hover:bg-brand-green-500 hover:text-white transition">Quote Now</button>
              </div>
              <div className="flex justify-between py-3">
                <div>
                  <strong className="block text-brand-ink">RFQ: Organic Turmeric Finger (CIF)</strong>
                  <span className="text-brand-muted">Buyer from Germany • Posted 5 hours ago</span>
                </div>
                <button className="px-3 py-1 bg-brand-sage text-brand-green-850 rounded hover:bg-brand-green-500 hover:text-white transition">Quote Now</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
