import React from 'react';
import Services from '@/components/home/Services';
import Process from '@/components/home/Process';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Trade Services | IGO Import & Export",
  description: "IGO's end-to-end trade services: farm-level procurement, quality inspection, export documentation, freight, and logistics for global agri-commodity buyers.",
  openGraph: {
    title: "Trade Services | IGO Import & Export",
    description: "End-to-end trade services: procurement, quality inspection, export documentation, freight, and logistics.",
    url: "https://igogroups.com/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-brand-green-950 py-20 text-center border-b border-brand-amber">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Trade Services Pipeline</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-lg">We handle the entire supply chain. From farm to port to your door.</p>
      </div>
      <Services />
      <Process />
    </main>
  );
}
