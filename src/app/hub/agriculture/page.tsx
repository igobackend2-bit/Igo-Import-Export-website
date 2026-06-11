import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import AgricultureHubClient from '@/components/hub/AgricultureHubClient';

// This function runs on the server to read the JSON file during build/request
async function getProducts() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load products.json:", error);
    return [];
  }
}

export default async function AgricultureHubPage() {
  const allProducts = await getProducts();

  return (
    <main className="min-h-screen bg-brand-paper">
      
      {/* 1. Agri-Commodities Hero */}
      <div className="bg-brand-green-950 text-white pt-12 pb-16 border-b-4 border-brand-amber relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/gallery_farm_sourcing.png')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-sm text-white/60 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-amber">Agriculture Hub</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-white">IGO Agri-Commodities Hub</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            The ultimate sovereign gateway to Indian agriculture. Explore our complete export catalog from Crop Care to Protein Cuts, meticulously sourced and inspected.
          </p>
        </div>
      </div>

      {/* Dynamic Catalog */}
      <AgricultureHubClient allProducts={allProducts} />

    </main>
  );
}
