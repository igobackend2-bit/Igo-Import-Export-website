"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "buyer";
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role as "buyer" | "seller");
    if (role === "seller") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/buyer");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <h1 className="text-2xl font-bold text-brand-green-950 mb-2 font-serif text-center">
        {role === "seller" ? "Seller Portal Login" : "Buyer Portal Login"}
      </h1>
      <p className="text-brand-muted text-center mb-8">
        {role === "seller" 
          ? "Manage your product listings, RFQs, and sales." 
          : "Track your procurement requests and active orders."}
      </p>

      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Email Address</label>
        <input type="email" className="w-full border border-brand-line rounded p-2 focus:outline-none focus:border-brand-green-500" placeholder="info@company.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Password</label>
        <input type="password" className="w-full border border-brand-line rounded p-2 focus:outline-none focus:border-brand-green-500" placeholder="••••••••" />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded text-brand-green-700" />
          Remember me
        </label>
        <Link href="#" className="text-brand-green-700 hover:underline">Forgot Password?</Link>
      </div>
      
      <button type="submit" className="w-full bg-brand-green-700 text-white font-bold py-3 rounded hover:bg-brand-green-850 transition flex justify-center items-center gap-2">
        <i className={`fa-solid ${role === "seller" ? "fa-store" : "fa-cart-shopping"}`}></i>
        Sign In as {role === "seller" ? "Seller" : "Buyer"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-brand-line">
          
          <Suspense fallback={<div className="text-center">Loading form...</div>}>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center text-sm text-brand-muted">
            Don't have an account? <Link href="/register" className="text-brand-green-700 font-bold hover:underline">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
