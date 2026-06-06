import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-6">Contact Our Trade Desk</h1>
            <p className="text-brand-muted text-lg mb-10">We are a fully operational managed trade desk. Whether you need a quote or have an operational query, our team responds within 24 hours.</p>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-solid fa-location-dot text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Global Trade Hub</h3>
                  <p className="text-brand-muted">No 17, Kovalan street, 2nd main road,<br/>Uthandi Kanathur, Chennai 600119.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Email Support</h3>
                  <p className="text-brand-muted">bankingbackend.indiagreen@gmail.com<br/>bd2@igogroups.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Direct Line & WhatsApp</h3>
                  <p className="text-brand-muted">+91 73977 89803<br/>+91 73977 89804<br/>+91 73977 89805</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-line">
            <h3 className="text-2xl font-bold text-brand-ink mb-6">Send an Inquiry</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Full Name *</label>
                  <input type="text" className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Company Name *</label>
                  <input type="text" className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="Global Imports Ltd" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Email Address *</label>
                <input type="email" className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Product of Interest *</label>
                <input type="text" className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="e.g. Sona Masoori Rice" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Message *</label>
                <textarea rows={4} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="Please specify quantity, destination port, etc."></textarea>
              </div>
              <button type="button" className="w-full py-3 bg-brand-green-950 text-white font-bold rounded hover:bg-brand-green-850 transition mt-4">
                Submit Inquiry
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
