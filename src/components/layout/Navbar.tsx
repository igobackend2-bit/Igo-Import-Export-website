"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState("en");
  const { role, email, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const truncateEmail = (e: string | null) => e ? (e.length > 20 ? e.slice(0, 20) + "..." : e) : "";

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    
    // Find the hidden Google Translate dropdown and trigger a change
    const gtSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (gtSelect) {
      gtSelect.value = lang;
      gtSelect.dispatchEvent(new Event("change"));
    }
  };

  // Hide the full navbar on dashboard pages (they have their own sidebar)
  const isDashboard = pathname.startsWith("/dashboard/seller") || pathname.startsWith("/dashboard/admin");
  if (isDashboard) return null;

  return (
    <header className="w-full bg-brand-green-950 text-white sticky top-0 z-50 shadow-lg">
      {/* Topbar */}
      <div className="bg-brand-ink text-xs py-2 px-4 border-b border-white/10 hidden md:flex justify-between items-center text-white/80">
        <div className="flex gap-4">
          <span><i className="fa-solid fa-envelope mr-2"></i>bankingbackend.indiagreen@gmail.com</span>
          <span><i className="fa-solid fa-phone mr-2"></i>+91 73977 89803</span>
          <span><i className="fa-brands fa-whatsapp text-green-400 mr-2"></i>WhatsApp: +91 73977 89803</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1 border-r border-white/20 pr-4">
            <i className="fa-solid fa-language"></i>
            <select 
              className="bg-transparent text-white outline-none cursor-pointer"
              value={currentLang}
              onChange={handleLanguageChange}
            >
              <option className="text-black" value="en">English</option>
              <option className="text-black" value="ta">Tamil</option>
              <option className="text-black" value="hi">Hindi</option>
              <option className="text-black" value="ar">Arabic</option>
              <option className="text-black" value="es">Spanish</option>
            </select>
          </span>
          {!isAuthenticated ? (
            <>
              <Link href="/login/buyer" className="hover:text-brand-amber transition">Buyer Login</Link>
              <Link href="/login/seller" className="hover:text-brand-amber transition">Seller Login</Link>
            </>
          ) : (
            <>
              <span className="text-brand-amber text-xs mr-2 border-r border-white/20 pr-4 flex items-center">
                <i className="fa-solid fa-user-circle mr-1"></i>
                {truncateEmail(email)}
              </span>
              {role === "admin" && (
                <Link href="/dashboard/admin" className="hover:text-brand-amber transition font-bold">
                  <i className="fa-solid fa-shield-halved mr-2"></i>Admin Panel
                </Link>
              )}
              {role === "seller" && (
                <Link href="/dashboard/seller" className="hover:text-brand-amber transition font-bold">
                  <i className="fa-solid fa-store mr-2"></i>My Dashboard
                </Link>
              )}
              {role === "buyer" && (
                <Link href="/dashboard/buyer" className="hover:text-brand-amber transition font-bold">
                  <i className="fa-solid fa-user mr-2"></i>Buyer Dashboard
                </Link>
              )}
              <button 
                onClick={() => { logout(); router.push("/"); }} 
                className="hover:text-red-400 transition ml-4"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-brand-amber text-brand-ink font-bold text-2xl px-2 py-1 rounded">IGO</div>
            <div className="flex flex-col">
              <strong className="text-lg leading-tight">IGO Import & Export</strong>
              <span className="text-xs text-brand-amber">Managed Trade Desk</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
              if (query) router.push(`/hub/agriculture?search=${encodeURIComponent(query)}`);
            }}
            className="hidden lg:flex flex-1 max-w-md mx-8 relative"
          >
            <input 
              name="search"
              type="text" 
              placeholder="Search verified export commodities..." 
              className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-5 pl-10 text-sm text-white placeholder-white/50 focus:outline-none focus:border-brand-amber focus:bg-white/20 transition"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"></i>
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-brand-ink text-xs font-bold px-3 py-1 rounded-full hover:bg-gray-100 transition">Search</button>
          </form>

          <div className="flex gap-3">
            {role === "seller" ? (
              <Link href="/dashboard/seller" className="px-4 py-2 bg-white text-brand-ink rounded font-bold hover:bg-gray-100 transition text-sm">
                <i className="fa-solid fa-plus mr-2"></i>Add New Product
              </Link>
            ) : role === "admin" ? (
              <Link href="/dashboard/admin" className="px-4 py-2 bg-white text-brand-ink rounded font-bold hover:bg-gray-100 transition text-sm">
                <i className="fa-solid fa-shield-halved mr-2"></i>Admin Panel
              </Link>
            ) : (
              <>
                <Link href="/checkout" className="px-4 py-2 bg-white text-brand-ink rounded font-bold hover:bg-gray-100 transition text-sm relative">
                  <i className="fa-solid fa-cart-shopping mr-2"></i>Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link href="/#rfq" className="px-4 py-2 bg-white text-brand-ink rounded font-bold hover:bg-gray-100 transition text-sm">
                  <i className="fa-solid fa-file-signature mr-2"></i>Post RFQ (Request for Quote)
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Secondary Navigation (Links) */}
        <nav className="hidden lg:flex gap-6 items-center text-sm font-medium border-t border-white/10 pt-3 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide">
          {role === "buyer" ? (
            <>
              <Link href="/" className={`transition ${pathname === "/" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Home</Link>
              <Link href="/hub/agriculture" className={`transition ${pathname.startsWith("/hub/agriculture") ? "text-brand-amber" : "hover:text-brand-amber"}`}>Browse Catalog</Link>
              <Link href="/dashboard/buyer#rfqs" className={`transition ${pathname === "/dashboard/buyer" ? "text-brand-amber" : "hover:text-brand-amber"}`}>My RFQs</Link>
              <Link href="/dashboard/buyer#orders" className={`transition ${pathname === "/dashboard/buyer" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Order Tracking</Link>
              <Link href="/certificates" className={`transition ${pathname === "/certificates" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Trade Certificates</Link>
            </>
          ) : role === "seller" ? (
            <>
              <Link href="/" className={`transition ${pathname === "/" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Home</Link>
              <Link href="/dashboard/seller" className={`transition ${pathname === "/dashboard/seller" ? "text-brand-amber" : "hover:text-brand-amber"}`}>My Listings</Link>
              <Link href="/dashboard/seller" className={`transition hover:text-brand-amber`}>Incoming RFQs</Link>
              <Link href="/dashboard/seller" className={`transition hover:text-brand-amber`}>Fulfillment</Link>
              <Link href="/dashboard/seller" className={`transition hover:text-brand-amber`}>Payouts</Link>
            </>
          ) : role === "admin" ? (
            <>
              <Link href="/" className={`transition ${pathname === "/" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Home</Link>
              <Link href="/dashboard/admin" className={`transition ${pathname === "/dashboard/admin" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Admin Dashboard</Link>
              <Link href="/certificates" className={`transition ${pathname === "/certificates" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Certificates</Link>
              <Link href="/contact" className={`transition ${pathname === "/contact" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Contact</Link>
            </>
          ) : (
            <>
              <Link href="/" className={`transition ${pathname === "/" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Home</Link>
              <Link href="/about" className={`transition ${pathname === "/about" ? "text-brand-amber" : "hover:text-brand-amber"}`}>About Us</Link>
              <Link href="/services" className={`transition ${pathname === "/services" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Services</Link>
              <Link href="/hub/agriculture" className={`transition ${pathname.startsWith("/hub/agriculture") ? "text-brand-amber" : "hover:text-brand-amber"}`}>Products</Link>
              <Link href="/clients" className={`transition ${pathname === "/clients" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Clients</Link>
              <Link href="/certificates" className={`transition ${pathname === "/certificates" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Certificates</Link>
              <Link href="/brands" className={`transition ${pathname === "/brands" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Our Brands</Link>
              <Link href="/offers" className={`transition ${pathname === "/offers" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Offers</Link>
              <Link href="/events" className={`transition ${pathname === "/events" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Trade & Events</Link>
              <Link href="/gallery" className={`transition ${pathname === "/gallery" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Gallery</Link>
              <Link href="/contact" className={`transition ${pathname === "/contact" ? "text-brand-amber" : "hover:text-brand-amber"}`}>Contact Us</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
