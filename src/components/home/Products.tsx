import React from 'react';
import Link from 'next/link';

export default function Products() {
  const categories = [
    {
      title: 'Agri Commodities',
      image: encodeURI('/products/Farmer Factory/Valluvam/cloves.jpg'),
      outcome: 'Fumigated, Certified, and FOB Ready.',
      items: ['Rice & Grains', 'Spices & Herbs', 'Sugar & Pulses'],
      search: "Valluvam"
    },
    {
      title: 'Nursery & Live Plants',
      image: encodeURI('/products/Nursery/indoor/Areca_Palm.png'),
      outcome: 'Phytosanitary cleared for global transit.',
      items: ['Indoor Foliage', 'Fruit Saplings', 'Tissue Culture'],
      search: "indoor"
    },
    {
      title: 'Fertilizers & Crop Care',
      image: encodeURI('/products/Crop Care/liquid/Amino_Acid_Fertilizer.png'),
      outcome: 'Lab-tested inputs with MSDS documentation.',
      items: ['Organic Bio-Fertilizers', 'NPK Blends', 'Neem Products'],
      search: "Fertilizer"
    },
    {
      title: 'Farm Machinery & Seeds',
      image: encodeURI('/products/Crop Care/Field Seeds/Groundnut.webp'),
      outcome: 'Pre-inspected inputs with warranty coverage.',
      items: ['Drip Irrigation', 'Field Seeds', 'Processing Tech'],
      search: "Seeds"
    }
  ];

  return (
    <section className="py-24 bg-brand-sage relative" id="products">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-brand-amber font-bold tracking-wider uppercase text-sm mb-2 block">Export-Ready Catalog</span>
            <h2 className="text-4xl font-serif font-bold text-brand-green-950 mb-4">Sourced. Inspected. Delivered.</h2>
            <p className="text-brand-muted text-lg">
              We don't just list products. Every category below represents established supply chains where we handle the procurement, quality control, and export paperwork.
            </p>
          </div>
          <Link href="#rfq" className="hidden md:inline-flex mt-6 md:mt-0 px-6 py-3 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition items-center gap-2">
            Request Custom Sourcing <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group flex flex-col h-full border border-brand-line">
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-green-950/20 group-hover:bg-transparent transition duration-300 z-10"></div>
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-brand-ink mb-2">{cat.title}</h3>
                <div className="bg-brand-sage px-3 py-2 rounded text-sm text-brand-green-700 font-medium mb-4 flex items-start gap-2">
                  <i className="fa-solid fa-shield-check mt-0.5"></i>
                  <span>{cat.outcome}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-brand-muted text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span> {item}
                    </li>
                  ))}
                </ul>
                <Link href={`/hub/agriculture?tab=${cat.search}`} className="w-full text-center py-2 border border-brand-line rounded text-brand-green-950 font-bold hover:bg-brand-green-50 transition mt-auto block">
                  View Full Specs
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="#rfq" className="inline-flex px-6 py-3 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition items-center gap-2">
            Request Custom Sourcing <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
