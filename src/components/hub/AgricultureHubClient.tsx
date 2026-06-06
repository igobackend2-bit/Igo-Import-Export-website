"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  category: string;
  origin: string;
  image_url: string;
};

function AgricultureHubContent({ allProducts }: { allProducts: Product[] }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialTab = searchParams.get("tab") || "All";

  const TABS = ["All", "Fruits", "Vegetables", "Juices & Drinks", "Fertilizers", "Valluvam", "Seeds", "Plants"];
  
  const [activeTab, setActiveTab] = useState(TABS.includes(initialTab) || initialTab !== "All" ? initialTab : "All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Fallback to initial tab if it's not strictly in the predefined array but passed via URL (e.g. "clove" -> Valluvam)
  // Actually, we'll map any custom url tab to predefined ones if possible.
  let currentActiveTab = activeTab;
  if (!TABS.includes(activeTab) && activeTab !== "All") {
    if (activeTab.toLowerCase() === "clove") currentActiveTab = "Valluvam";
    if (activeTab.toLowerCase() === "indoor") currentActiveTab = "Plants";
    if (activeTab.toLowerCase() === "millet") currentActiveTab = "Valluvam";
  }

  const filteredProducts = allProducts.filter(p => {
    let matchesTab = true;
    if (currentActiveTab !== "All") {
      const t = currentActiveTab.toLowerCase();
      const cat = p.category.toLowerCase();
      const origin = p.origin.toLowerCase();
      
      if (t === "juices & drinks") {
        matchesTab = cat.includes("juice") || cat.includes("drink") || origin.includes("cafe");
      } else if (t === "plants") {
        matchesTab = cat.includes("nursery") || cat.includes("indoor") || cat.includes("outdoor") || origin.includes("nursery");
      } else if (t === "seeds") {
        matchesTab = cat.includes("seed");
      } else if (t === "valluvam") {
        matchesTab = cat.includes("valluvam") || origin.includes("farmer factory") && !cat.includes("fruit") && !cat.includes("vegetable");
      } else if (t === "fertilizers") {
        matchesTab = cat.includes("fertilizer") || cat.includes("liquid") || cat.includes("powder") || cat.includes("chemical");
      } else if (t === "fruits") {
        matchesTab = (cat.includes("fruit") || origin.includes("fruit")) && !cat.includes("seed");
      } else if (t === "vegetables") {
        matchesTab = (cat.includes("vegetable") || origin.includes("vegetable")) && !cat.includes("seed");
      } else {
        matchesTab = cat.includes(t) || origin.includes(t);
      }
    }
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Directory Area (Left 8 columns) */}
        <div className="lg:col-span-8 space-y-12">
          
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b-2 border-brand-green-950 pb-2">
              <h2 className="text-2xl font-bold text-brand-ink">Live Export Catalog ({filteredProducts.length})</h2>
              
              <div className="relative w-full md:w-64 mt-4 md:mt-0">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-brand-line rounded-md py-2 px-3 pr-10 text-sm focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber"
                />
                <i className="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-muted"></i>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {TABS.map(tab => (
                <button 
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    currentActiveTab === tab 
                      ? "bg-brand-green-950 text-white shadow-md" 
                      : "bg-white border border-brand-line text-brand-muted hover:border-brand-amber hover:text-brand-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-brand-line overflow-hidden hover:shadow-xl transition group flex flex-col h-full">
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img src={encodeURI(prod.image_url)} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-brand-green-950 shadow-sm">
                      {prod.origin}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-brand-amber font-bold tracking-wider uppercase mb-1 block">
                      {prod.category}
                    </span>
                    <h3 className="font-bold text-brand-ink leading-tight mb-4 group-hover:text-brand-green-700 transition">
                      {prod.name}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-brand-line flex items-center justify-between">
                      <span className="text-xs text-brand-muted"><i className="fa-solid fa-box mr-1"></i> Bulk Volume</span>
                      <button className="text-brand-green-950 text-xs font-bold hover:text-brand-amber transition">
                        Request Quote <i className="fa-solid fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-brand-muted border border-dashed border-brand-line rounded-xl">
                  No products found matching your criteria.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Sidebar Area (Right 4 columns) */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-brand-line p-6 sticky top-24">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-950 opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <h3 className="text-xl font-serif font-bold mb-2 text-brand-green-950">Custom Agri-Sourcing</h3>
             <p className="text-sm text-brand-muted mb-6">Need a specific agricultural commodity not listed? Submit a request directly to our procurement team.</p>
             
             <form className="space-y-4 relative z-10">
               <div>
                 <input type="text" placeholder="Product Name (e.g., Fox Nuts)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Quantity (MT)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
                 <input type="text" placeholder="Dest. Port" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
               </div>
               <div>
                 <textarea rows={3} placeholder="Additional Specs (Moisture %, Packaging)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber"></textarea>
               </div>
               <button type="button" className="w-full py-3 bg-brand-amber text-brand-green-950 font-bold rounded hover:bg-yellow-400 transition text-sm shadow-md">
                 Submit Procurement Request
               </button>
             </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function AgricultureHubClient({ allProducts }: { allProducts: Product[] }) {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-center">Loading catalog...</div>}>
      <AgricultureHubContent allProducts={allProducts} />
    </Suspense>
  );
}
