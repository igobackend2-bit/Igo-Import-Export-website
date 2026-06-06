"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get("role") as "buyer" | "seller";
    
    login(role);

    if (role === "seller") {
      router.push("/dashboard/seller");
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
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-ink mb-1">First Name</label>
                <input type="text" className="w-full border border-brand-line rounded p-2" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-ink mb-1">Last Name</label>
                <input type="text" className="w-full border border-brand-line rounded p-2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Company Name</label>
              <input type="text" className="w-full border border-brand-line rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Email Address</label>
              <input type="email" className="w-full border border-brand-line rounded p-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="border border-brand-line rounded p-3 flex items-center gap-2 cursor-pointer hover:border-brand-green-500">
                  <input type="radio" name="role" value="buyer" defaultChecked /> Buyer (Importer)
                </label>
                <label className="border border-brand-line rounded p-3 flex items-center gap-2 cursor-pointer hover:border-brand-green-500">
                  <input type="radio" name="role" value="seller" /> Seller (Exporter)
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-1">Password</label>
              <input type="password" className="w-full border border-brand-line rounded p-2" />
            </div>
            
            <button type="submit" className="w-full bg-brand-green-700 text-white font-bold py-3 rounded hover:bg-brand-green-850 transition mt-4">
              Register
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
