/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export default function CategoryCarousel() {
  const categories = [
    { name: "Spices & Condiments", icon: "fa-pepper-hot", image: encodeURI("/products/Farmer Factory/Valluvam/clove.jpg"), search: "Valluvam" },
    { name: "Cereals & Grains", icon: "fa-wheat-awn", image: encodeURI("/products/Farmer Factory/Valluvam/BarnyardMillet.jpg"), search: "Valluvam" },
    { name: "Fresh Fruits", icon: "fa-apple-whole", image: encodeURI("/products/Farmer Factory/Fruits/SenthooraMango.webp"), search: "Fruits" },
    { name: "Fresh Vegetables", icon: "fa-carrot", image: encodeURI("/products/Farmer Factory/Vegetables/TomatoBangalore.jfif"), search: "Vegetables" },
    { name: "Field Seeds", icon: "fa-seedling", image: encodeURI("/products/Crop Care/Field Seeds/Groundnut.webp"), search: "Seeds" },
    { name: "Chemical Fertilizers", icon: "fa-flask", image: encodeURI("/products/Crop Care/Chemical Fertilizers/Ammonium_Nitrate.webp"), search: "Fertilizers" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-brand-line pb-6">
          <div>
            <span className="text-brand-amber font-bold tracking-widest uppercase text-sm block mb-2">Export Catalog</span>
            <h2 className="text-4xl font-serif font-bold text-brand-green-950">Primary Commodities</h2>
          </div>
          <Link href="/hub/agriculture" className="text-brand-green-700 font-bold hover:text-brand-amber transition mt-4 md:mt-0 flex items-center gap-2 group">
            View All Categories
            <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <Link href={`/hub/agriculture?tab=${cat.search}`} key={index} className="group flex flex-col h-full rounded-xl overflow-hidden shadow-md hover:shadow-2xl border border-brand-line transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-40 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-green-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-green-950 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-45">
                  <i className="fa-solid fa-arrow-up"></i>
                </div>
              </div>
              <div className="p-4 bg-white flex flex-col items-center text-center flex-1">
                <i className={`fa-solid ${cat.icon} text-2xl text-brand-amber mb-3`}></i>
                <h3 className="font-bold text-brand-ink text-sm leading-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
