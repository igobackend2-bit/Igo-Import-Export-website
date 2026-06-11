import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import AgricultureHubClient from '@/components/hub/AgricultureHubClient';

import { getApprovedProducts } from '@/lib/productService';

// This function runs on the server to read from Firebase
async function getProducts() {
  try {
    const products = await getApprovedProducts();
    if (products && products.length > 0) {
      return products;
    }
    
    // Fallback: If DB is empty, load from local file for initial seed view
    const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    return [];
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

export default async function AgricultureHubPage() {
  const allProducts = await getProducts();

  return (
    <main className="min-h-screen bg-brand-paper">
      
      {/* 1. Agri-Commodities Hero */}
      <div className="bg-brand-green-950 text-white pt-12 pb-16 border-b-4 border-brand-amber relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/gallery_farm_sourcing.png')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-sm text-white/60 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-amber">Agriculture Hub</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4" style={{color: '#ffffff', textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.95)'}}>IGO Agri-Commodities Hub</h1>
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
