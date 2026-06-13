/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export default function TrendingProducts() {
  const featuredProducts = [
    {
      id: 1,
      title: "Senthoora Mango (Farmer Factory)",
      image: encodeURI("/products/Farmer Factory/Fruits/SenthooraMango.webp"),
      moq: "1000 kgs",
      tag: "Fresh Produce"
    },
    {
      id: 2,
      title: "Barnyard Millet (Valluvam)",
      image: encodeURI("/products/Farmer Factory/Valluvam/BarnyardMillet.jpg"),
      moq: "1x20ft Container",
      tag: "Organic"
    },
    {
      id: 3,
      title: "Ammonium Nitrate (Crop Care)",
      image: encodeURI("/products/Crop Care/Chemical Fertilizers/Ammonium_Nitrate.webp"),
      moq: "10 MT",
      tag: "Agri-Inputs"
    },
    {
      id: 4,
      title: "Premium Groundnut Seeds",
      image: encodeURI("/products/Crop Care/Field Seeds/Groundnut.webp"),
      moq: "500 Kg",
      tag: "Seeds"
    }
  ];

  return (
    <section className="py-20 bg-brand-paper border-b border-brand-line">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <span className="text-brand-amber font-bold tracking-wider uppercase text-sm mb-2 block">Live Trade Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green-950">Trending Products</h2>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-white rounded-lg p-1 border border-brand-line shadow-sm mt-6 md:mt-0">
            <button className="px-6 py-2 bg-brand-green-950 text-white font-bold rounded-md text-sm transition shadow-sm">
              Featured
            </button>
            <button className="px-6 py-2 text-brand-muted hover:text-brand-ink font-bold rounded-md text-sm transition">
              Latest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <Link key={prod.id} href={`/product/${prod.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-brand-line transition duration-300 group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-white p-4">
                <span className="absolute top-4 left-4 bg-brand-amber text-brand-ink text-xs font-bold px-2 py-1 rounded z-20">
                  {prod.tag}
                </span>
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-grow border-t border-brand-line/50">
                <h3 className="font-bold text-brand-ink leading-snug mb-4 group-hover:text-brand-green-700 transition">
                  {prod.title}
                </h3>
                <div className="mt-auto bg-brand-sage px-3 py-2 rounded-md">
                  <span className="block text-xs text-brand-muted mb-1 uppercase tracking-wide">Min. Order</span>
                  <span className="font-bold text-brand-green-950 text-sm"><i className="fa-solid fa-box mr-1"></i> {prod.moq}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
