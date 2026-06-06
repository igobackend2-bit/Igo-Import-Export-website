"use client";

import { useState, useEffect } from "react";
import type { SellerProduct } from "@/types/product";
import { STORAGE_KEYS } from "@/types/product";

export default function SellerProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPROVED_PRODUCTS);
      if (raw) {
        setProducts(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 bg-white border-b border-brand-line">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <span className="text-brand-green-700 font-bold tracking-wider uppercase text-sm mb-2 block">
              <i className="fa-solid fa-circle-check mr-2"></i>Verified Listings
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green-950">
              From Our Verified Sellers
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm text-brand-muted">
              {products.length} approved product{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-brand-sage/30 rounded-2xl border border-brand-line p-16 text-center">
            <div className="w-20 h-20 bg-brand-sage rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-store text-3xl text-brand-green-700"></i>
            </div>
            <h3 className="text-xl font-bold text-brand-green-950 mb-2">
              Seller Marketplace Coming Soon
            </h3>
            <p className="text-brand-muted max-w-md mx-auto">
              Verified seller products will appear here once approved. Our sellers are adding fresh listings daily!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-line transition duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-50 p-4">
                  <span className="absolute top-4 left-4 bg-brand-green-700 text-white text-xs font-bold px-2 py-1 rounded z-20">
                    <i className="fa-solid fa-circle-check mr-1"></i>Verified
                  </span>
                  <span className="absolute top-4 right-4 bg-brand-amber text-brand-ink text-xs font-bold px-2 py-1 rounded z-20">
                    {prod.category}
                  </span>
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-lg bg-brand-sage/30">
                      <i className="fa-solid fa-box-open text-4xl text-brand-green-500/50"></i>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow border-t border-brand-line/50">
                  <h3 className="font-bold text-brand-ink leading-snug mb-1 group-hover:text-brand-green-700 transition">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-brand-muted mb-4">
                    <i className="fa-solid fa-location-dot mr-1"></i>
                    {prod.originCountry}
                  </p>

                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <span className="text-lg font-bold text-brand-green-700">{prod.price}</span>
                      <span className="text-xs text-brand-muted ml-1">{prod.priceUnit}</span>
                    </div>
                    <div className="bg-brand-sage px-3 py-2 rounded-md">
                      <span className="block text-xs text-brand-muted mb-0.5 uppercase tracking-wide">
                        Min. Order
                      </span>
                      <span className="font-bold text-brand-green-950 text-sm">
                        <i className="fa-solid fa-box mr-1"></i>{prod.moq}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
