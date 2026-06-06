import React from 'react';

export default function Stats() {
  const stats = [
    { number: "18+", label: "Destination Countries", icon: "fa-earth-americas" },
    { number: "1.2M", label: "Metric Tons Exported", icon: "fa-ship" },
    { number: "100%", label: "Verified Suppliers", icon: "fa-shield-halved" },
    { number: "$50M+", label: "Trade Facilitated", icon: "fa-money-bill-trend-up" },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-brand-green-950">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80" 
          alt="Agriculture Fields" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-transparent to-brand-green-950"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-brand-amber font-bold tracking-widest uppercase text-sm block mb-4">Global Scale</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Proven Track Record in Global Trade</h2>
          <p className="text-white/70 text-lg">
            Our sovereign trade desk has consistently delivered massive volumes of agricultural commodities to the most demanding international markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl text-center transform hover:-translate-y-2 transition-all duration-300 hover:bg-white/20 hover:border-brand-amber/50 hover:shadow-[0_0_30px_rgba(196,154,58,0.2)]">
              <div className="w-16 h-16 mx-auto bg-brand-amber/20 rounded-full flex items-center justify-center text-brand-amber text-2xl mb-6 shadow-inner">
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <h3 className="text-5xl font-bold font-serif text-white mb-2">{stat.number}</h3>
              <p className="text-white/80 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
