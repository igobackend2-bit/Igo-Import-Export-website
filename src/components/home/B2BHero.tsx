/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function B2BHero() {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 flex items-center justify-center overflow-hidden">
      {/* Massive Background Image */}
      <div className="absolute inset-0 bg-brand-green-950">
        <img 
          src="/images/b2b_hero_banner.png" 
          alt="B2B Wholesale Trade Desk" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-950/80 via-brand-green-950/40 to-brand-paper"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
          India's <span className="text-brand-amber">Agri-Commodity</span> Trade Desk
        </h1>
        
        <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow">
          Source, Inspect, and Ship globally. We manage the entire supply chain from Indian farms to your destination port.
        </p>

        {/* Massive Global Search Bar (TradeIndia Style) */}
        <div className="max-w-4xl mx-auto bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 border-4 border-white/20 backdrop-blur-md">
          
          <div className="relative flex-1 flex items-center border border-brand-line rounded-lg bg-brand-paper px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-brand-green-700 text-lg mr-3"></i>
            <input 
              type="text" 
              placeholder="Search Agri-Commodities (e.g. Basmati Rice, Red Onion, Tractors...)" 
              className="w-full bg-transparent focus:outline-none text-brand-ink text-lg placeholder-brand-muted"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none px-8 py-3 md:py-4 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition text-lg whitespace-nowrap">
              Search Hub
            </button>
            <Link href="/#rfq" className="flex-1 md:flex-none px-6 py-3 md:py-4 bg-white text-brand-green-950 font-bold rounded-lg hover:bg-gray-100 transition text-lg whitespace-nowrap flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-paper-plane mr-2"></i> Post RFQ
            </Link>
          </div>

        </div>

        {/* Quick Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm font-bold text-white drop-shadow">Trending Now:</span>
          {['G4 Green Chilli', '1121 Basmati Rice', 'Red Onion', 'Turmeric Finger'].map((tag) => (
             <Link href={`/category/search?q=${tag}`} key={tag} className="text-xs font-bold text-brand-ink bg-white/90 px-3 py-1 rounded-full hover:bg-brand-amber transition">
               {tag}
             </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

