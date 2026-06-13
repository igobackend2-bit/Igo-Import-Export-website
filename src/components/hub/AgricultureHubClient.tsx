/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

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

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Remove Fruits, Vegetables, and Juices & Drinks from allProducts completely
  const validProducts = allProducts.filter(p => {
    const cat = p.category.toLowerCase();
    const origin = p.origin.toLowerCase();
    
    // Check if it belongs to the removed categories
    const isJuice = cat.includes("juice") || cat.includes("drink") || origin.includes("cafe");
    const isFruit = (cat.includes("fruit") || origin.includes("fruit")) && !cat.includes("seed");
    const isVegetable = (cat.includes("vegetable") || origin.includes("vegetable")) && !cat.includes("seed");
    
    return !(isJuice || isFruit || isVegetable);
  });

  const filteredProducts = validProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const { addToCart } = useCart();

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
                      <button 
                        onClick={() => addToCart({ id: prod.id, name: prod.name, imageUrl: prod.image_url, price: "Quote on Request" })}
                        className="bg-brand-green-950 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-brand-green-850 transition flex items-center gap-1"
                      >
                        <i className="fa-solid fa-cart-plus"></i> Add To Cart
                      </button>
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
             
             <form className="space-y-4 relative z-10" onSubmit={(e) => {
               e.preventDefault();
               const form = e.target as HTMLFormElement;
               const product = (form.elements[0] as HTMLInputElement).value;
               const quantity = (form.elements[1] as HTMLInputElement).value;
               const dest = (form.elements[2] as HTMLInputElement).value;
               const specs = (form.elements[3] as HTMLTextAreaElement).value;

               if(!product || !quantity) {
                 alert("Product Name and Quantity are required.");
                 return;
               }

               import('@/lib/whatsapp').then(({ sendWhatsAppMessage }) => {
                 sendWhatsAppMessage({
                   source: 'Procurement Request',
                   product: product,
                   quantity: quantity,
                   destination: dest,
                   specifications: specs
                 });
                 alert("Procurement Request opened in WhatsApp!");
               });
             }}>
               <div>
                 <input type="text" required placeholder="Product Name (e.g., Fox Nuts)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <input type="text" required placeholder="Quantity (MT)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
                 <input type="text" placeholder="Dest. Port" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber" />
               </div>
               <div>
                 <textarea rows={3} placeholder="Additional Specs (Moisture %, Packaging)" className="w-full bg-brand-paper border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-amber"></textarea>
               </div>
               <button type="submit" className="w-full py-3 bg-white text-brand-green-950 font-bold rounded hover:bg-gray-100 transition text-sm shadow-md">
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
