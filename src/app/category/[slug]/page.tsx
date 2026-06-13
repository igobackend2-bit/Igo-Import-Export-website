import React from 'react';
import Link from 'next/link';

// Mocked data for the Fresh Vegetables category
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "A Grade Fresh Red Onion",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80",
    price: "FOB $350 - $400 / MT",
    specs: {
      "MOQ": "1x20ft Container (14 MT)",
      "Style": "Fresh",
      "Moisture (%)": "5% - 10%",
      "Processing Form": "Raw, Sorted",
      "Shelf Life": "30-45 Days (Ventilated)",
      "Cultivation": "Natural / Organic options",
    },
    tags: ["Verified Source", "Global GAP"]
  },
  {
    id: 2,
    title: "Fresh Green Chillies (G4/Teja)",
    image: "https://images.unsplash.com/photo-1596649280689-53e34b8c738e?auto=format&fit=crop&w=300&q=80",
    price: "FOB $1,100 / MT",
    specs: {
      "MOQ": "5 Metric Tons",
      "Size": "8-12 cm",
      "Storage Temp": "7-10°C",
      "Moisture (%)": "Nil (Surface)",
      "Shelf Life": "10-15 Days",
      "Variety": "G4, Jwala, Bullet",
    },
    tags: ["High Pungency", "Air Freight Ready"]
  },
  {
    id: 3,
    title: "Premium Indian Garlic Bulbs",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=300&q=80",
    price: "FOB $1,800 / MT",
    specs: {
      "MOQ": "1x20ft Container",
      "Size": "40mm+, 45mm+, 50mm+",
      "Style": "Fresh, Natural Shape",
      "Processing Form": "Raw, Unpeeled",
      "Packaging": "20/50 kg Mesh Bags",
      "Cultivation": "Conventional",
    },
    tags: ["Strong Aroma", "Long Shelf Life"]
  },
  {
    id: 4,
    title: "Hybrid Fresh Tomatoes",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
    price: "FOB $450 / MT",
    specs: {
      "MOQ": "10 Metric Tons",
      "Color": "Brilliant Red",
      "Storage Temp": "0 to 7°C",
      "Processing Form": "Raw",
      "Shelf Life": "7-10 Days",
      "Packaging": "Corrugated Boxes",
    },
    tags: ["Export Grade", "Firm Texture"]
  }
];

const SUB_CATEGORIES = [
  "Fresh Red Onion", "Fresh Tomatoes", "Green Chillies", "Garlic", 
  "Fresh Carrot", "Root Vegetables", "Exotic Vegetables", "Drumsticks"
];

const SOURCING_ZONES = [
  "Nashik Onion Belt", "AP Mango/Chilli Belt", "Ooty Organic Zone", "Punjab Agri Hub", "Gujarat Spices Region"
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Format slug for display (e.g. "fresh-vegetables" -> "Fresh Vegetables")
  const categoryName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-brand-paper">
      
      {/* Breadcrumbs & Hero */}
      <div className="bg-brand-green-950 text-white pt-8 pb-12 border-b-4 border-brand-amber relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-sm text-white/60 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-white transition">Export Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-amber">{categoryName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Export Quality {categoryName}</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Sourced directly from verified Indian agricultural zones. IGO handles the phytosanitary inspections, sorting, packaging, and logistics.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Sourcing Zones Bar */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-3">Verified Sourcing Zones</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {SOURCING_ZONES.map((zone, i) => (
              <button key={i} className="whitespace-nowrap px-4 py-2 bg-white border border-brand-line rounded-md text-sm font-medium text-brand-ink hover:border-brand-green-950 hover:bg-brand-sage transition shadow-sm">
                <i className="fa-solid fa-location-dot text-brand-green-700 mr-2"></i>{zone}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Commodity Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-line mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-brand-ink mr-2">Filter by:</span>
              {SUB_CATEGORIES.map((sub, i) => (
                <button key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${i === 0 ? 'bg-brand-green-950 text-white border-brand-green-950' : 'bg-brand-paper text-brand-muted border-brand-line hover:border-brand-amber hover:text-brand-ink'}`}>
                  {sub}
                </button>
              ))}
            </div>

            {/* Technical Product List */}
            <div className="space-y-6">
              {MOCK_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-brand-line overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition duration-300">
                  
                  {/* Image Column */}
                  <div className="md:w-64 h-64 md:h-auto bg-gray-100 relative border-r border-brand-line">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="bg-white/90 backdrop-blur text-brand-green-950 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                          <i className="fa-solid fa-check text-green-600 mr-1"></i>{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specs Column */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-brand-ink mb-1 hover:text-brand-green-700 transition cursor-pointer">{product.title}</h2>
                    <span className="text-brand-amber font-bold text-lg mb-4">{product.price}</span>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex border-b border-brand-line pb-1">
                          <span className="text-xs text-brand-muted w-1/3">{key}:</span>
                          <span className="text-xs font-bold text-brand-ink w-2/3">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 px-4 py-2 bg-brand-green-950 text-white font-bold rounded hover:bg-brand-green-850 transition text-sm flex items-center justify-center gap-2">
                        Request Quote (FOB/CIF) <i className="fa-solid fa-arrow-right"></i>
                      </button>
                      <button className="px-4 py-2 border border-brand-line text-brand-ink font-bold rounded hover:bg-brand-sage transition text-sm flex items-center justify-center gap-2">
                        View Lab Report <i className="fa-solid fa-file-pdf text-red-500"></i>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Managed Trade Sidebar */}
          <div className="lg:w-80 space-y-6">
            
            <div className="bg-brand-green-950 rounded-xl p-6 text-white shadow-xl">
              <h3 className="font-serif text-xl font-bold mb-2 text-brand-amber">IGO Quality Assurance Protocol</h3>
              <p className="text-sm text-white/80 mb-6">We don&apos;t just connect you to suppliers. We ensure what ships meets your exact specifications.</p>
              
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">1</div>
                  <div>
                    <h4 className="font-bold text-sm">Farm-Level Sourcing</h4>
                    <p className="text-xs text-white/60">Procurement directly from APMC markets and verified contract farms.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">2</div>
                  <div>
                    <h4 className="font-bold text-sm">Sorting & Grading</h4>
                    <p className="text-xs text-white/60">Machine and manual sorting to meet precise diameter and color specs.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-amber">3</div>
                  <div>
                    <h4 className="font-bold text-sm">Phytosanitary Clearance</h4>
                    <p className="text-xs text-white/60">Fumigation and pest-control certification prior to port loading.</p>
                  </div>
                </li>
              </ul>
              
              <button className="w-full mt-6 py-2 border border-white text-white font-bold rounded hover:bg-white hover:text-brand-green-950 hover:text-brand-green-950 transition text-sm">
                Learn About Our Process
              </button>
            </div>

            <div className="bg-white rounded-xl border border-brand-line p-6 shadow-sm">
              <h3 className="font-bold text-brand-ink mb-4">Export Packaging</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-brand-sage p-3 rounded text-center">
                  <i className="fa-solid fa-box text-brand-green-700 text-xl mb-2"></i>
                  <p className="font-medium">Mesh Bags</p>
                </div>
                <div className="bg-brand-sage p-3 rounded text-center">
                  <i className="fa-solid fa-box-open text-brand-green-700 text-xl mb-2"></i>
                  <p className="font-medium">Corrugated</p>
                </div>
                <div className="bg-brand-sage p-3 rounded text-center">
                  <i className="fa-solid fa-pallet text-brand-green-700 text-xl mb-2"></i>
                  <p className="font-medium">Palletized</p>
                </div>
                <div className="bg-brand-sage p-3 rounded text-center">
                  <i className="fa-solid fa-snowflake text-brand-green-700 text-xl mb-2"></i>
                  <p className="font-medium">Reefer</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
