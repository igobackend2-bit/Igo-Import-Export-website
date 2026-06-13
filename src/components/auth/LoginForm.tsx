"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type LoginRole = "buyer" | "seller" | "admin";

export default function LoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, sendReset } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(role, email, password);
    if (!result.success) {
      setError(result.error || "Login failed");
      setIsLoading(false);
      return;
    }
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "seller") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/buyer");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    const result = await sendReset(forgotEmail);
    setForgotLoading(false);
    if (result.success) {
      setForgotMsg("✅ Password reset email sent! Check your inbox.");
    } else {
      setForgotMsg(`❌ ${result.error}`);
    }
  };

  const roleDetails = {
    buyer: { label: "Buyer", icon: "fa-cart-shopping", desc: "Browse & procure commodities" },
    seller: { label: "Seller", icon: "fa-store", desc: "List products & manage sales" },
    admin: { label: "Admin", icon: "fa-shield-halved", desc: "Manage platform operations" },
  };

  const isAdmin = role === "admin";

  if (showForgot) {
    return (
      <div className={`w-full max-w-md transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="bg-brand-amber text-brand-ink font-bold text-3xl px-3 py-1.5 rounded-lg shadow-lg">IGO</div>
            <div className="flex flex-col text-left">
              <strong className="text-lg leading-tight text-white">IGO Import & Export</strong>
              <span className="text-xs text-brand-amber">Managed Trade Desk</span>
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl border border-brand-line overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-2xl font-bold font-serif text-brand-green-950 mb-1">Reset Password</h1>
            <p className="text-sm text-brand-muted">Enter your email to receive a reset link.</p>
          </div>
          <form className="px-8 pb-8 space-y-4" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-brand-ink">Email Address</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-muted/50"></i>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm border border-brand-line focus:outline-none focus:ring-2 focus:ring-brand-green-500/30"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            {forgotMsg && (
              <div className={`px-4 py-3 rounded-lg text-sm ${forgotMsg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {forgotMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full font-bold py-3 rounded-lg bg-brand-green-700 text-white hover:bg-brand-green-850 transition flex justify-center items-center gap-2 text-sm disabled:opacity-70"
            >
              {forgotLoading ? <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</> : "Send Reset Email"}
            </button>
            <button type="button" onClick={() => setShowForgot(false)} className="w-full text-center text-sm text-brand-muted hover:text-brand-ink transition">
              ← Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
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

      <div className="mb-4">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Portal Selection
        </Link>
      </div>

      {/* Card */}
      <div className={`rounded-2xl shadow-2xl border overflow-hidden transition-all duration-500 ${isAdmin ? "bg-slate-900 border-slate-700" : "bg-white border-brand-line"}`}>
        <div className={`px-8 pt-8 pb-4 ${isAdmin ? "text-white" : "text-brand-ink"}`}>
          <h1 className={`text-2xl font-bold font-serif mb-1 ${isAdmin ? "text-white" : "text-brand-green-950"}`}>
            {role === "admin" ? "Admin Control Panel" : role === "seller" ? "Seller Portal Login" : "Buyer Portal Login"}
          </h1>
          <p className={`text-sm ${isAdmin ? "text-slate-400" : "text-brand-muted"}`}>
            {roleDetails[role].desc}
          </p>
        </div>

        <form className="px-8 pb-8 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isAdmin ? "text-slate-300" : "text-brand-ink"}`}>Email Address</label>
            <div className="relative">
              <i className={`fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-sm ${isAdmin ? "text-slate-500" : "text-brand-muted/50"}`}></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
                  isAdmin
                    ? "bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:ring-brand-amber/50 focus:border-brand-amber"
                    : "bg-white border border-brand-line focus:ring-brand-green-500/30 focus:border-brand-green-500"
                }`}
                placeholder={isAdmin ? "admin@yourdomain.com" : "info@company.com"}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isAdmin ? "text-slate-300" : "text-brand-ink"}`}>Password</label>
            <div className="relative">
              <i className={`fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-sm ${isAdmin ? "text-slate-500" : "text-brand-muted/50"}`}></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
                  isAdmin
                    ? "bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:ring-brand-amber/50 focus:border-brand-amber"
                    : "bg-white border border-brand-line focus:ring-brand-green-500/30 focus:border-brand-green-500"
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-brand-muted">
              <input type="checkbox" className="rounded" />
              <span className={isAdmin ? "text-slate-400" : ""}>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className={`hover:underline ${isAdmin ? "text-brand-amber" : "text-brand-green-700"}`}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 text-sm shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 ${
              isAdmin ? "bg-white text-brand-ink hover:bg-gray-100" : "bg-brand-green-700 text-white hover:bg-brand-green-850"
            }`}
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className={`fa-solid ${roleDetails[role].icon}`}></i>
              {isAdmin ? "Access Admin Panel" : `Sign In as ${role === "seller" ? "Seller" : "Buyer"}`}</>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </form>
      </div>

      {role !== "admin" && (
        <div className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-amber font-bold hover:underline">Register here</Link>
        </div>
      )}
    </div>
  );
}
