"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { UserRole } from "@/lib/authService";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const displayName = `${firstName} ${lastName}`.trim();

    const result = await register(role, email, password, {
      displayName,
      companyName,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Registration failed");
      return;
    }

    if (role === "seller") {
      router.push("/dashboard/seller");
    } else if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/buyer");
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-brand-line my-12">
          <h1 className="text-2xl font-bold text-brand-green-950 mb-2 font-serif text-center">Create an Account</h1>
          <p className="text-brand-muted text-center mb-8">Join the IGO B2B Marketplace.</p>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-ink mb-1">First Name</label>
                <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-brand-line rounded p-2 focus:ring-2 focus:ring-brand-green-500/30" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-ink mb-1">Last Name</label>
                <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-brand-line rounded p-2 focus:ring-2 focus:ring-brand-green-500/30" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Company Name</label>
              <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border border-brand-line rounded p-2 focus:ring-2 focus:ring-brand-green-500/30" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Email Address</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-brand-line rounded p-2 focus:ring-2 focus:ring-brand-green-500/30" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border rounded p-3 flex items-center gap-2 cursor-pointer transition ${role === 'buyer' ? 'border-brand-green-700 bg-brand-green-50' : 'border-brand-line hover:border-brand-green-500'}`}>
                  <input type="radio" name="role" value="buyer" checked={role === "buyer"} onChange={() => setRole("buyer")} className="accent-brand-green-700" /> Buyer (Importer)
                </label>
                <label className={`border rounded p-3 flex items-center gap-2 cursor-pointer transition ${role === 'seller' ? 'border-brand-green-700 bg-brand-green-50' : 'border-brand-line hover:border-brand-green-500'}`}>
                  <input type="radio" name="role" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} className="accent-brand-green-700" /> Seller (Exporter)
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} className="w-full border border-brand-line rounded p-2 focus:ring-2 focus:ring-brand-green-500/30" />
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-brand-green-700 text-white font-bold py-3 rounded hover:bg-brand-green-850 transition mt-4 disabled:opacity-70 flex justify-center items-center gap-2">
              {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-brand-muted">
            Already have an account? <Link href="/login" className="text-brand-green-700 font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
