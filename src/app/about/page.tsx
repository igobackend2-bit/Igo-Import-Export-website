import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-line">
          <div className="h-64 bg-brand-green-950 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white relative z-10 text-center px-4">About IGO Import & Export</h1>
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-brand-ink mb-6">India's Premier Managed Trade Desk</h2>
            <p className="text-brand-muted leading-relaxed mb-6">
              IGO Import & Export was established to solve the biggest problem in global commodity trade: the unreliability of directories. While other platforms simply give you a list of unverified suppliers, we act as your dedicated team on the ground.
            </p>
            <p className="text-brand-muted leading-relaxed mb-8">
              We handle sourcing, quality inspection, export documentation, and freight for global buyers. With over 18+ destination countries served and a 100% documentation success rate, we ensure your imports arrive safely, legally, and on time.
            </p>
            <div className="bg-brand-sage p-6 rounded-lg border border-brand-green-950/10">
              <h3 className="font-bold text-brand-green-950 mb-3">The Sovereign Ecosystem</h3>
              <ul className="space-y-2 text-brand-muted">
                <li><i className="fa-solid fa-check text-brand-green-600 mr-2"></i> Farmers Factory (Fresh Produce)</li>
                <li><i className="fa-solid fa-check text-brand-green-600 mr-2"></i> IGO Crop Care (Agri-Inputs)</li>
                <li><i className="fa-solid fa-check text-brand-green-600 mr-2"></i> IGO Nursery (Plants & Saplings)</li>
              </ul>
            </div>
            <div className="mt-10 text-center">
              <Link href="/contact" className="px-8 py-3 bg-brand-amber text-brand-ink font-bold rounded hover:bg-amber-400 transition shadow-md inline-block">
                Contact Our Desk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
