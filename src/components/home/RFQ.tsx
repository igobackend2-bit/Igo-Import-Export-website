import React from 'react';

export default function RFQ() {
  return (
    <section className="py-24 bg-white relative" id="rfq">
      <div className="absolute inset-0 bg-brand-sage/30 skew-y-3 transform origin-top-left -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-brand-line overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Info Panel */}
          <div className="lg:w-5/12 bg-brand-green-950 text-white p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed79be264?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
            <div className="relative z-10">
              <span className="text-brand-amber font-bold tracking-wider uppercase text-sm mb-4 block">Fast & Secure</span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6 leading-tight">Get a Verified Quote in 24 Hours</h2>
              <p className="text-white/80 mb-8 leading-relaxed">
                Stop waiting weeks for unreliable supplier quotes. Tell us your requirements, and our trade desk will provide a fully-costed quote including product, inspection, and freight to your destination.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-amber"><i className="fa-solid fa-clock"></i></div>
                  <span className="font-medium">24-hour turnaround guaranteed</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-amber"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                  <span className="font-medium">FOB, CIF, and DDP pricing available</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-amber"><i className="fa-solid fa-shield-check"></i></div>
                  <span className="font-medium">100% data privacy & secure sourcing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:w-7/12 p-10 lg:p-16">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Product Required *</label>
                  <input type="text" placeholder="e.g. Non-Basmati Rice, NPK Fertilizer" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Target Quantity *</label>
                  <input type="text" placeholder="e.g. 2 x 20ft Containers" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Destination Port / Country</label>
                  <input type="text" placeholder="e.g. Jebel Ali, UAE" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Required Certifications</label>
                  <input type="text" placeholder="e.g. Organic, Phytosanitary, Halal" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-ink mb-2">Additional Specifications</label>
                <textarea rows={4} placeholder="Detailed specs, packaging requirements, target price..." className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-brand-line">
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Your Name *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-2">Email Address *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-brand-line focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/20 outline-none transition" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <span className="text-sm text-brand-muted"><i className="fa-solid fa-lock mr-1"></i> Your information is secure.</span>
                <button type="button" className="bg-brand-green-700 text-white font-bold px-8 py-4 rounded-lg hover:bg-brand-green-850 transition shadow-lg flex items-center gap-2 transform hover:-translate-y-1">
                  Submit RFQ <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
