import React from 'react';

export default function BrandsPage() {
  const brands = [
    { name: "Farmers Factory", focus: "Fresh Produce & FMCG", desc: "Our premium label for export-quality fresh fruits, vegetables, and processed foods." },
    { name: "IGO Crop Care", focus: "Agricultural Inputs", desc: "Certified organic fertilizers, neem products, and soil amendments for global farming." },
    { name: "IGO Nursery", focus: "Live Plants", desc: "Phytosanitary-cleared tissue culture and live saplings for international landscaping." }
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-4">Our Sovereign Brands</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">In addition to private labeling for our clients, IGO owns and operates established export brands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-brand-line p-8 hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 bg-brand-sage rounded-full flex items-center justify-center text-brand-green-950 font-bold text-xl mb-6 border-2 border-brand-amber">
                {brand.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-brand-ink mb-2">{brand.name}</h2>
              <span className="inline-block px-3 py-1 bg-brand-green-950 text-white text-xs rounded-full mb-4">{brand.focus}</span>
              <p className="text-brand-muted">{brand.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
