import React from 'react';

export default function AgriServicesGrid() {
  const services = [
    {
      title: "Phytosanitary Clearance",
      desc: "Complete biological inspection and pest-control certification before loading.",
      icon: "fa-seedling"
    },
    {
      title: "Custom Sorting & Grading",
      desc: "Machine and manual sorting to meet precise diameter and color specs for your market.",
      icon: "fa-filter"
    },
    {
      title: "Contract Farming",
      desc: "Secure long-term supply volumes with our pre-season contract farming network.",
      icon: "fa-tractor"
    },
    {
      title: "Ocean Freight Logistics",
      desc: "FOB, CIF, or Door-to-Door. We handle the container booking and port operations.",
      icon: "fa-ship"
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-brand-line">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-green-950 mb-2">Managed Trade Services</h2>
            <p className="text-brand-muted max-w-xl">We are not just a directory. We handle the physical movement of your commodities.</p>
          </div>
          <button className="text-brand-amber font-bold hover:text-brand-green-950 transition mt-4 md:mt-0">
            View All Services <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div key={i} className="p-6 bg-brand-paper rounded-xl border border-brand-line hover:border-brand-amber transition group">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-brand-green-700 text-2xl mb-6 shadow-sm group-hover:scale-110 transition duration-300">
                <i className={`fa-solid ${svc.icon}`}></i>
              </div>
              <h3 className="font-bold text-brand-ink text-lg mb-2">{svc.title}</h3>
              <p className="text-sm text-brand-muted">{svc.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
