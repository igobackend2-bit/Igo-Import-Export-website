/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function OffersPage() {
  const offers = [
    {
      id: "OFF-2026-001",
      title: "Premium Sona Masoori Rice - Bulk Volume",
      discount: "FOB Discount: $15/MT",
      validity: "Valid until June 30, 2026",
      minOrder: "100 MT (4x 20ft Containers)",
      origin: "Andhra Pradesh, India",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=800&q=80",
      description: "Direct mill-procured premium Sona Masoori Rice (Sortex clean). Exceptional grain length and aroma. Immediate loading available at Chennai Port."
    },
    {
      id: "OFF-2026-002",
      title: "Guntur Red Chillies (Teja/S17)",
      discount: "CIF Special Rate Available",
      validity: "Valid until July 15, 2026",
      minOrder: "14 MT (1x 40ft HC Container)",
      origin: "Guntur, Andhra Pradesh",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      description: "High ASTA color value, pungent Teja S17 variety. Completely sun-dried and stemless options available. SGS certification provided pre-shipment."
    },
    {
      id: "OFF-2026-003",
      title: "Fresh Cavendish Bananas",
      discount: "Volume Bonus: +2 Pallets Free",
      validity: "Valid for Next 5 Shipments",
      minOrder: "1x 40ft Reefer Container",
      origin: "Maharashtra, India",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
      description: "Premium export quality, directly sourced from contract farms. Harvested at optimal maturity for maximum transit shelf-life."
    }
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-amber font-bold tracking-widest uppercase text-sm mb-4 block">Exclusive Trade Desk Pricing</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-green-950 mb-6">Current Export Offers</h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Take advantage of special bulk volume pricing and spot shipment opportunities directly from our sovereign trade desk.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-brand-line flex flex-col group hover:-translate-y-2 transition-transform duration-500">
              
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">
                  {offer.discount}
                </div>
                <div className="absolute inset-0 bg-brand-green-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">{offer.id}</span>
                  <span className="text-xs font-bold text-brand-amber bg-brand-amber/10 px-2 py-1 rounded">{offer.validity}</span>
                </div>
                
                <h3 className="text-2xl font-bold font-serif text-brand-green-950 mb-4">{offer.title}</h3>
                <p className="text-brand-muted text-sm mb-6 flex-1 leading-relaxed">{offer.description}</p>
                
                <div className="bg-brand-sage/50 p-4 rounded-lg mb-6 border border-brand-line">
                  <div className="flex justify-between mb-2 border-b border-brand-line/50 pb-2">
                    <span className="text-sm font-bold text-brand-ink">Min Order (MOQ)</span>
                    <span className="text-sm text-brand-muted">{offer.minOrder}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-bold text-brand-ink">Origin</span>
                    <span className="text-sm text-brand-muted">{offer.origin}</span>
                  </div>
                </div>

                <Link href={`/contact?offer=${offer.id}`} className="block w-full text-center py-4 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-amber hover:text-brand-green-950 transition-colors shadow-md">
                  Claim This Offer <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Alert */}
        <div className="mt-16 bg-brand-green-950 text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-16 h-16 bg-brand-amber rounded-full flex items-center justify-center text-3xl text-brand-green-950 flex-shrink-0 shadow-[0_0_20px_rgba(196,154,58,0.5)]">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif mb-2">Don't see your commodity?</h3>
              <p className="text-white/70">Our trade desk sources over 50+ agricultural products. Send us your exact requirements for custom pricing.</p>
            </div>
          </div>
          <Link href="/contact" className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-brand-green-950 hover:text-brand-green-950 font-bold rounded-lg transition-colors whitespace-nowrap">
            Submit Custom RFQ
          </Link>
        </div>

      </div>
    </main>
  );
}

