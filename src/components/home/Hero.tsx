/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-green-950">
      
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-950 via-brand-green-950/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-green-950/90 z-10"></div>
        <img 
          src="/images/hero_banner_agri.png" 
          alt="Premium Agricultural Trade" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <div className="h-[2px] w-12 bg-brand-amber"></div>
            <span className="text-brand-amber font-bold tracking-[0.2em] uppercase text-sm">Sovereign Trade Desk</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-8 drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Powering Global <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-yellow-200">
              Agricultural Supply
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 leading-relaxed border-l-4 border-brand-amber pl-6 animate-fade-in-up backdrop-blur-sm bg-brand-green-950/30 p-4 rounded-r-xl" style={{ animationDelay: '0.4s' }}>
            We don't just list suppliers. We are India's premier managed trade desk, providing end-to-end sourcing, quality inspection, and global freight for sovereign buyers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link href="#rfq" className="px-8 py-4 bg-gradient-to-r from-brand-amber to-yellow-500 text-brand-green-950 font-bold rounded-lg hover:from-yellow-400 hover:to-brand-amber transition shadow-[0_0_20px_rgba(196,154,58,0.3)] hover:shadow-[0_0_30px_rgba(196,154,58,0.6)] flex items-center justify-center gap-3 group border border-yellow-300">
              Post Your Requirement
              <i className="fa-solid fa-arrow-right transform group-hover:translate-x-2 transition-transform"></i>
            </Link>
            <Link href="/hub/agriculture" className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-lg hover:bg-white/20 transition backdrop-blur-md flex items-center justify-center gap-3">
              Explore Live Commodities
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-white/50">
        <span className="text-xs uppercase tracking-widest mb-2">Scroll to Discover</span>
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </section>
  );
}

