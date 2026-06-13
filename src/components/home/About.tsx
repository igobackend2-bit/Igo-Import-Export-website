/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sage rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-amber/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Grid (Asymmetric) */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
            <div className="flex flex-col gap-4 pt-12">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-64 relative group">
                <img src="/images/gallery_farm_sourcing.png" alt="Sourcing" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
              </div>
              <div className="h-40 md:h-48 rounded-2xl overflow-hidden border-2 border-white shadow-xl mt-8 group">
                <img src="/images/gallery_port_logistics.png" alt="Logistics" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-48 md:h-64 rounded-2xl overflow-hidden border-2 border-white shadow-xl mb-8 group">
                <img src="/images/gallery_quality_inspection.png" alt="Quality Control" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-brand-green-950/20"></div>
              </div>
              
              <div className="bg-brand-green-950 rounded-2xl p-6 text-white shadow-2xl flex flex-col justify-center h-full relative overflow-hidden">
                <i className="fa-solid fa-quote-left text-4xl text-brand-amber/30 absolute top-4 left-4"></i>
                <h4 className="font-serif font-bold text-xl mb-2 relative z-10">Our Promise</h4>
                <p className="text-white/80 text-sm relative z-10 leading-relaxed">
                  We bridge the gap between Indian agriculture and global markets with 100% transparency.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 relative z-10">
            <span className="text-brand-amber font-bold tracking-widest uppercase text-sm mb-4 block flex items-center gap-4">
              <div className="h-[1px] w-8 bg-brand-amber"></div>
              About IGO
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-8 leading-tight">
              India's Premier <br/>Managed Trade Desk
            </h2>
            <div className="space-y-6 text-brand-muted text-lg">
              <p className="leading-relaxed">
                IGO Import & Export was established to solve the biggest problem in global commodity trade: the unreliability of directories. While other platforms simply give you a list of unverified suppliers, we act as your dedicated team on the ground.
              </p>
              <p className="leading-relaxed">
                We handle end-to-end sourcing, stringent quality inspection, complex export documentation, and global freight for sovereign buyers. With a 100% documentation success rate, we ensure your imports arrive safely, legally, and exactly on time.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-brand-sage/30 px-4 py-2 rounded-full border border-brand-green-950/10 text-brand-green-950 font-bold text-sm">
                <i className="fa-solid fa-check-circle text-brand-green-600"></i> Verified Suppliers Only
              </div>
              <div className="flex items-center gap-3 bg-brand-sage/30 px-4 py-2 rounded-full border border-brand-green-950/10 text-brand-green-950 font-bold text-sm">
                <i className="fa-solid fa-check-circle text-brand-green-600"></i> Full SGS Certification
              </div>
              <div className="flex items-center gap-3 bg-brand-sage/30 px-4 py-2 rounded-full border border-brand-green-950/10 text-brand-green-950 font-bold text-sm">
                <i className="fa-solid fa-check-circle text-brand-green-600"></i> FOB & CIF Shipping
              </div>
            </div>

            <div className="mt-12">
              <Link href="/about" className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green-950 text-white font-bold rounded hover:bg-white hover:text-brand-ink transition shadow-lg group">
                Discover Our Ecosystem
                <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

