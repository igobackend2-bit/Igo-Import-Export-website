import React from 'react';

export default function ClientsPage() {
  const regions = [
    { name: "Middle East", count: "120+ Containers/yr", icon: "fa-earth-asia" },
    { name: "Southeast Asia", count: "80+ Containers/yr", icon: "fa-earth-oceania" },
    { name: "Europe", count: "45+ Containers/yr", icon: "fa-earth-europe" },
    { name: "North America", count: "30+ Containers/yr", icon: "fa-earth-americas" },
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-4">Global Footprint</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">Trusted by hypermarkets, food processors, and wholesalers across 18+ countries.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-line mb-16 relative overflow-hidden">
           {/* Abstract Map Background */}
           <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
             {regions.map((region, i) => (
               <div key={i} className="text-center p-6 border border-brand-line rounded-xl bg-white hover:border-brand-amber transition">
                 <div className="w-16 h-16 mx-auto bg-brand-sage rounded-full flex items-center justify-center mb-4 text-brand-green-700">
                    <i className={`fa-solid ${region.icon} text-2xl`}></i>
                 </div>
                 <h3 className="font-bold text-brand-ink text-lg">{region.name}</h3>
                 <p className="text-brand-amber font-bold">{region.count}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </main>
  );
}
