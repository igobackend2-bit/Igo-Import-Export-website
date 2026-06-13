/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export default function AgriCategoryGrid() {
  const categories = [
    {
      name: "Indian Spices",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
      link: "/category/indian-spices",
      subItems: ["Turmeric Finger", "Cumin Seeds", "Red Chilli"]
    },
    {
      name: "Grains & Cereals",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80",
      link: "/category/grains-cereals",
      subItems: ["Basmati Rice", "Non-Basmati Rice", "Wheat"]
    },
    {
      name: "Agri Machinery",
      image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a2401?auto=format&fit=crop&w=400&q=80",
      link: "/category/agri-machinery",
      subItems: ["Tractors", "Harvesters", "Irrigation Systems"]
    },
    {
      name: "Oilseeds",
      image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=400&q=80",
      link: "/category/oilseeds",
      subItems: ["Groundnut", "Sesame Seeds", "Soybean"]
    }
  ];

  return (
    <section className="py-16 bg-brand-paper" id="categories">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green-950 mb-4">Browse Top Categories</h2>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">Explore our massive catalog of verified Indian agricultural exports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-brand-line overflow-hidden hover:shadow-lg transition group flex flex-col h-full">
              <div className="h-32 overflow-hidden relative">
                 <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                 <div className="absolute inset-0 bg-brand-green-950/40 group-hover:bg-brand-green-950/20 transition duration-300"></div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <Link href={cat.link} className="font-bold text-brand-ink text-lg mb-3 hover:text-brand-amber transition block leading-tight">
                  {cat.name}
                </Link>
                <ul className="space-y-1 mb-4 flex-1">
                  {cat.subItems.map((item, i) => (
                    <li key={i}>
                      <Link href={`${cat.link}?filter=${item}`} className="text-sm text-brand-muted hover:text-brand-green-700 transition">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={cat.link} className="text-xs font-bold text-brand-amber uppercase tracking-wider group-hover:text-brand-green-950 transition inline-block">
                  View All <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
           <Link href="/hub/agriculture" className="inline-block px-8 py-3 border-2 border-brand-green-950 text-brand-green-950 font-bold rounded hover:bg-brand-green-950 hover:text-white transition">
             Explore Agriculture Hub
           </Link>
        </div>

      </div>
    </section>
  );
}
