import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import AgricultureHubClient from '@/components/hub/AgricultureHubClient';

type Product = {
  id: string;
  name: string;
  category: string;
  origin: string;
  image_url: string;
};

// Loads the same real product catalog used by the Agriculture Hub, instead of
// the hardcoded mock onion/chilli/garlic/tomato products this page used to
// show for every single category slug regardless of what was actually clicked.
function getAllProducts(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error('Failed to read local products.json:', err);
  }
  return [];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Format slug for display (e.g. "fresh-vegetables" -> "Fresh Vegetables")
  const categoryName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const allProducts = getAllProducts();

  // Loosely match the requested category slug against each product's real
  // category/origin fields (e.g. "chemical-fertilizers" -> "Chemical Fertilizers").
  const slugWords = params.slug.toLowerCase().split('-').filter(w => w.length > 2);
  const matchedProducts = allProducts.filter(p => {
    const haystack = `${p.category} ${p.origin}`.toLowerCase();
    return slugWords.some(w => haystack.includes(w));
  });

  // If nothing in the real catalog matches this category yet, fall back to
  // showing the full live catalog rather than inventing unrelated products.
  const showingFallback = matchedProducts.length === 0;
  const displayProducts = showingFallback ? allProducts : matchedProducts;

  return (
    <main className="min-h-screen bg-brand-paper">

      {/* Breadcrumbs & Hero */}
      <div className="bg-brand-green-950 text-white pt-8 pb-12 border-b-4 border-brand-amber relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/gallery_farm_sourcing.png')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-sm text-white/60 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/hub/agriculture" className="hover:text-white transition">Export Catalog</Link>
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

        {showingFallback && (
          <div className="mb-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
            We don&apos;t currently have live listings tagged specifically as &ldquo;{categoryName}&rdquo; — here&apos;s our
            full live export catalog instead. <Link href="/contact" className="font-bold underline hover:text-amber-900">Contact us</Link> if
            you&apos;re sourcing this commodity and we&apos;ll help directly.
          </div>
        )}

        {/* Managed Trade Info Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-brand-line p-5 shadow-sm">
            <h3 className="font-bold text-brand-ink mb-1"><i className="fa-solid fa-location-dot text-brand-green-700 mr-2"></i>Farm-Level Sourcing</h3>
            <p className="text-xs text-brand-muted">Procurement directly from APMC markets and verified contract farms.</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-line p-5 shadow-sm">
            <h3 className="font-bold text-brand-ink mb-1"><i className="fa-solid fa-magnifying-glass text-brand-green-700 mr-2"></i>Sorting &amp; Grading</h3>
            <p className="text-xs text-brand-muted">Machine and manual sorting to meet precise diameter and color specs.</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-line p-5 shadow-sm">
            <h3 className="font-bold text-brand-ink mb-1"><i className="fa-solid fa-file-shield text-brand-green-700 mr-2"></i>Phytosanitary Clearance</h3>
            <p className="text-xs text-brand-muted">Fumigation and pest-control certification prior to port loading.</p>
          </div>
        </div>

      </div>

      {/* Real, live catalog — same data source and Add to Cart / Request Quote
          behavior as the main Agriculture Hub, filtered to this category. */}
      <AgricultureHubClient allProducts={displayProducts} />
    </main>
  );
}
