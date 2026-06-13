/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { SellerProduct } from "@/types/product";
import { getApprovedProducts } from "@/lib/productService";

export default function SellerProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchProducts = async () => {
      const prod = await getApprovedProducts();
      const formatted = prod.map(p => ({
        ...p,
        submittedAt: typeof p.submittedAt === "object" && p.submittedAt !== null && "toDate" in p.submittedAt ? p.submittedAt.toDate().toISOString() : String(p.submittedAt || new Date().toISOString()),
        updatedAt: typeof p.updatedAt === "object" && p.updatedAt !== null && "toDate" in p.updatedAt ? p.updatedAt.toDate().toISOString() : String(p.updatedAt || new Date().toISOString()),
      })) as SellerProduct[];
      setProducts(formatted);
    };
    fetchProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.submittedAt).getTime();
      const bTime = new Date(b.updatedAt || b.submittedAt).getTime();
      return bTime - aTime;
    });
  }, [products]);

  const categories = useMemo(() => {
    const cats = new Set(sortedProducts.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [sortedProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return sortedProducts;
    return sortedProducts.filter(p => p.category === selectedCategory);
  }, [sortedProducts, selectedCategory]);

  const isNew = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  };

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 bg-white border-b border-brand-line">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
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
              {filteredProducts.length} approved product{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Category Filters */}
        {products.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(8); }}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? "bg-brand-green-950 text-white shadow-md" 
                    : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

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
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-brand-muted bg-gray-50 rounded-xl border border-brand-line">
            No products found in this category.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, visibleCount).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-line transition duration-300 group flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-50 p-4 flex-shrink-0">
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                      <span className="bg-brand-green-700 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        <i className="fa-solid fa-circle-check mr-1"></i>Verified
                      </span>
                      {isNew(prod.updatedAt || prod.submittedAt) && (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    <span className="absolute top-4 right-4 bg-brand-amber text-brand-ink text-xs font-bold px-2 py-1 rounded z-20 shadow">
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
                    <h3 className="font-bold text-brand-ink leading-snug mb-1 group-hover:text-brand-green-700 transition line-clamp-2">
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
            
            {visibleCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="px-8 py-3 bg-white border-2 border-brand-green-950 text-brand-green-950 font-bold rounded-lg hover:bg-brand-green-950 hover:text-white transition-all duration-300"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-green-950/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-[fadeInUp_0.3s_ease-out]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-brand-ink hover:bg-gray-200 transition z-20"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-gray-50 min-h-[300px] flex items-center justify-center relative p-8">
                {selectedProduct.imageUrl ? (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-contain rounded-xl shadow-sm" />
                ) : (
                  <i className="fa-solid fa-image text-8xl text-gray-300"></i>
                )}
                {isNew(selectedProduct.updatedAt || selectedProduct.submittedAt) && (
                  <span className="absolute top-6 left-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow">
                    NEW LISTING
                  </span>
                )}
              </div>
              
              <div className="md:w-3/5 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-brand-amber text-brand-ink text-xs font-bold px-2.5 py-1 rounded">
                    {selectedProduct.category}
                  </span>
                  <span className="bg-brand-green-100 text-brand-green-800 text-xs font-bold px-2.5 py-1 rounded">
                    <i className="fa-solid fa-circle-check mr-1"></i>Verified Seller
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold font-serif text-brand-green-950 mb-2">
                  {selectedProduct.name}
                </h2>
                
                <p className="text-brand-muted mb-6">
                  <i className="fa-solid fa-location-dot mr-2"></i>Origin: {selectedProduct.originCountry}
                </p>

                <div className="bg-gray-50 rounded-xl p-5 mb-6 flex justify-between items-center border border-brand-line">
                  <div>
                    <div className="text-sm text-brand-muted mb-1">Asking Price</div>
                    <div className="text-2xl font-bold text-brand-green-700">
                      {selectedProduct.price} <span className="text-base text-brand-ink">{selectedProduct.priceUnit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-brand-muted mb-1">Minimum Order Qty</div>
                    <div className="text-xl font-bold text-brand-ink">{selectedProduct.moq}</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-brand-ink mb-2">Product Description</h4>
                  <p className="text-brand-muted leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Link 
                    href={`/contact?subject=Inquiry for ${selectedProduct.name} (ID: ${selectedProduct.id})`}
                    className="flex-1 bg-brand-green-950 text-white font-bold py-3.5 px-6 rounded-xl text-center hover:bg-brand-green-850 transition shadow-lg"
                  >
                    Contact Seller <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Link>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="sm:w-32 bg-gray-100 text-brand-ink font-bold py-3.5 px-6 rounded-xl hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
