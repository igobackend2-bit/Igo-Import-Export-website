import React from 'react';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      title: "Contract Farming & Sourcing",
      desc: "Direct procurement from farmers via 'Farmers Factory'. Guaranteed volume and quality without middlemen markups.",
      image: "https://images.unsplash.com/photo-1592982537447-6f296c09b0b1?auto=format&fit=crop&w=800&q=80",
      icon: "fa-tractor"
    },
    {
      title: "Quality Control & Processing",
      desc: "State-of-the-art sorting, grading, and cleaning facilities. Every batch meets strict European and US FDA standards.",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80",
      icon: "fa-magnifying-glass-chart"
    },
    {
      title: "Global Logistics (FOB/CIF)",
      desc: "Complete freight forwarding, custom clearance, and multi-modal transport from Indian ports to your destination.",
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=80",
      icon: "fa-globe"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-brand-amber font-bold tracking-widest uppercase text-sm block mb-4">Value-Added Services</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-6">End-to-End Trade Management</h2>
          <p className="text-brand-muted text-lg">
            We handle everything from the farm gate to your warehouse door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group rounded-2xl overflow-hidden shadow-lg border border-brand-line hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white">
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-green-950/40 group-hover:bg-brand-green-950/20 transition-colors duration-500 z-10"></div>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-1000" />
                <div className="absolute bottom-4 left-4 z-20 w-12 h-12 bg-brand-amber text-brand-green-950 rounded-full flex items-center justify-center text-xl shadow-lg transform group-hover:-translate-y-2 transition-transform">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold font-serif text-brand-green-950 mb-4">{service.title}</h3>
                <p className="text-brand-muted leading-relaxed mb-6 flex-1">{service.desc}</p>
                <Link href="/services" className="text-brand-green-700 font-bold hover:text-brand-amber transition flex items-center gap-2 group-hover:translate-x-2 w-max">
                  Read More <i className="fa-solid fa-arrow-right text-sm"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
