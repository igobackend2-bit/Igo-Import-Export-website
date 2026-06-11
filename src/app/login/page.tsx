"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type LoginTab = "buyer" | "seller" | "admin";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "buyer";
  const [activeTab, setActiveTab] = useState<LoginTab>(
    initialRole === "admin" ? "admin" : initialRole === "seller" ? "seller" : "buyer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for animation feel
    await new Promise((r) => setTimeout(r, 400));

    const result = login(activeTab, email, password);

    if (!result.success) {
      setError(result.error || "Login failed");
      setIsLoading(false);
      return;
    }

    if (activeTab === "admin") {
      router.push("/dashboard/admin");
    } else if (activeTab === "seller") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/buyer");
    }
  };

  const tabs: { key: LoginTab; label: string; icon: string; desc: string }[] = [
    { key: "buyer", label: "Buyer", icon: "fa-cart-shopping", desc: "Browse & procure commodities" },
    { key: "seller", label: "Seller", icon: "fa-store", desc: "List products & manage sales" },
    { key: "admin", label: "Admin", icon: "fa-shield-halved", desc: "Manage platform operations" },
  ];

  const isAdmin = activeTab === "admin";

  return (
    <div
      className={`w-full max-w-md transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="bg-brand-amber text-brand-ink font-bold text-3xl px-3 py-1.5 rounded-lg shadow-lg">
            IGO
          </div>
          <div className="flex flex-col text-left">
            <strong className="text-lg leading-tight text-white">IGO Import & Export</strong>
            <span className="text-xs text-brand-amber">Managed Trade Desk</span>
          </div>
        </Link>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6 border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setError("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-2.5 px-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? tab.key === "admin"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "bg-white text-brand-green-950 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-1.5`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        className={`rounded-2xl shadow-2xl border overflow-hidden transition-all duration-500 ${
          isAdmin
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-brand-line"
        }`}
      >
        {/* Card Header */}
        <div
          className={`px-8 pt-8 pb-4 transition-colors duration-500 ${
            isAdmin ? "text-white" : "text-brand-ink"
          }`}
        >
          <h1
            className={`text-2xl font-bold font-serif mb-1 transition-colors duration-500 ${
              isAdmin ? "text-white" : "text-brand-green-950"
            }`}
          >
            {activeTab === "admin"
              ? "Admin Control Panel"
              : activeTab === "seller"
                ? "Seller Portal Login"
                : "Buyer Portal Login"}
          </h1>
          <p className={`text-sm ${isAdmin ? "text-slate-400" : "text-brand-muted"}`}>
            {tabs.find((t) => t.key === activeTab)?.desc}
          </p>
        </div>

        {/* Form */}
        <form className="px-8 pb-8 space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isAdmin ? "text-slate-300" : "text-brand-ink"}`}
            >
              Email Address
            </label>
            <div className="relative">
              <i
                className={`fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                  isAdmin ? "text-slate-500" : "text-brand-muted/50"
                }`}
              ></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
                  isAdmin
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-amber/50 focus:border-brand-amber"
                    : "bg-white border border-brand-line focus:ring-brand-green-500/30 focus:border-brand-green-500"
                }`}
                placeholder={isAdmin ? "admin@igo.com" : "info@company.com"}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${isAdmin ? "text-slate-300" : "text-brand-ink"}`}
            >
              Password
            </label>
            <div className="relative">
              <i
                className={`fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                  isAdmin ? "text-slate-500" : "text-brand-muted/50"
                }`}
              ></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
                  isAdmin
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-amber/50 focus:border-brand-amber"
                    : "bg-white border border-brand-line focus:ring-brand-green-500/30 focus:border-brand-green-500"
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {activeTab !== "admin" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-brand-muted">
                <input type="checkbox" className="rounded text-brand-green-700" />
                Remember me
              </label>
              <Link href="#" className="text-brand-green-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 text-sm shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 ${
              isAdmin
                ? "bg-brand-amber text-brand-ink hover:bg-amber-400"
                : "bg-brand-green-700 text-white hover:bg-brand-green-850"
            }`}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className={`fa-solid ${tabs.find((t) => t.key === activeTab)?.icon}`}></i>
                {isAdmin
                  ? "Access Admin Panel"
                  : `Sign In as ${activeTab === "seller" ? "Seller" : "Buyer"}`}
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-[fadeInUp_0.3s_ease-out]">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <div className={`border rounded-lg px-4 py-3 text-xs flex flex-col gap-1 ${isAdmin ? "bg-slate-800/50 border-slate-600 text-slate-300" : "bg-gray-50 border-gray-200 text-brand-muted"}`}>
            <div className="font-bold mb-1 flex items-center gap-1.5"><i className="fa-solid fa-circle-info"></i> Demo Credentials</div>
            <div><strong>Admin:</strong> admin@igo.com / admin123</div>
            <div><strong>Seller:</strong> any email / seller123</div>
          </div>
        </form>
      </div>

      {activeTab !== "admin" && (
        <div className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-amber font-bold hover:underline">
            Register here
          </Link>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0e2417 0%, #163a25 30%, #1f5f8f 70%, #0e2417 100%)",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Suspense
          fallback={
            <div className="text-center text-white/60">
              <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
