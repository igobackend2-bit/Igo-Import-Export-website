import Link from "next/link";
import LoginLayout from "@/components/auth/LoginLayout";

export default function PortalSelectionPage() {
  return (
    <LoginLayout>
      <div className="w-full max-w-md transition-all duration-500 opacity-100 translate-y-0">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="bg-brand-amber text-brand-ink font-bold text-3xl px-3 py-1.5 rounded-lg shadow-lg">IGO</div>
            <div className="flex flex-col text-left">
              <strong className="text-lg leading-tight text-white">IGO Import & Export</strong>
              <span className="text-xs text-brand-amber">Managed Trade Desk</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-2xl border overflow-hidden bg-white border-brand-line transition-all duration-500">
          <div className="px-8 pt-8 pb-4 text-brand-ink">
            <h1 className="text-2xl font-bold font-serif mb-1 text-brand-green-950">
              Select Your Portal
            </h1>
            <p className="text-sm text-brand-muted">
              Choose your role to log in and access your dashboard.
            </p>
          </div>

          <div className="px-8 pb-8 space-y-4">
            <Link href="/login/buyer" className="w-full flex items-center p-4 border border-brand-line rounded-xl hover:border-brand-green-500 hover:shadow-md transition group bg-white">
              <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center text-brand-green-700 mr-4 group-hover:scale-110 transition">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-ink group-hover:text-brand-green-700 transition">Buyer Portal</h3>
                <p className="text-xs text-brand-muted">Browse & procure commodities</p>
              </div>
              <i className="fa-solid fa-chevron-right text-brand-muted group-hover:text-brand-green-500 transition"></i>
            </Link>

            <Link href="/login/seller" className="w-full flex items-center p-4 border border-brand-line rounded-xl hover:border-brand-amber hover:shadow-md transition group bg-white">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-brand-amber mr-4 group-hover:scale-110 transition">
                <i className="fa-solid fa-store text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-ink group-hover:text-brand-amber transition">Seller Portal</h3>
                <p className="text-xs text-brand-muted">List products & manage sales</p>
              </div>
              <i className="fa-solid fa-chevron-right text-brand-muted group-hover:text-brand-amber transition"></i>
            </Link>

            <Link href="/login/admin" className="w-full flex items-center p-4 border border-brand-line rounded-xl hover:border-slate-800 hover:shadow-md transition group bg-white">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 mr-4 group-hover:scale-110 transition">
                <i className="fa-solid fa-shield-halved text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-ink group-hover:text-slate-800 transition">Admin Portal</h3>
                <p className="text-xs text-brand-muted">Manage platform operations</p>
              </div>
              <i className="fa-solid fa-chevron-right text-brand-muted group-hover:text-slate-800 transition"></i>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-amber font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </LoginLayout>
  );
}
