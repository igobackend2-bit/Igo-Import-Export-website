import React from 'react';

export default function Process() {
  const steps = [
    {
      icon: "fa-seedling",
      title: "1. Verified Procurement",
      desc: "We source directly from contract farms and certified millers across India, ensuring traceability at the root level.",
      image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: "fa-microscope",
      title: "2. Quality Inspection",
      desc: "Every container undergoes rigorous 3rd-party testing (SGS/Bureau Veritas) for moisture, ASTA, and pesticide residues.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: "fa-file-signature",
      title: "3. Export Documentation",
      desc: "Our desk handles Phyto, Certificate of Origin, Bill of Lading, and customs clearances for 100% compliance.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: "fa-ship",
      title: "4. Global Freight",
      desc: "FOB and CIF execution. We secure the best ocean freight rates and ensure timely vessel loading at major Indian ports.",
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-24 bg-brand-paper relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-brand-amber font-bold tracking-widest uppercase text-sm block mb-4">The IGO Pathway</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-6">Seamless Execution</h2>
          <p className="text-brand-muted text-lg">
            From the Indian farm to your global warehouse, we manage the entire supply chain to completely eliminate your procurement risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-[60%] w-full h-[2px] bg-brand-line z-0">
                  <div className="h-full bg-brand-amber w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              )}
              
              <div className="bg-white rounded-2xl p-6 border border-brand-line relative z-10 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500 h-full flex flex-col">
                <div className="w-16 h-16 bg-brand-green-950 text-brand-amber rounded-full flex items-center justify-center text-2xl mb-6 shadow-xl border-4 border-white group-hover:bg-brand-amber group-hover:text-brand-green-950 transition-colors">
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                
                <h3 className="text-xl font-bold font-serif text-brand-green-950 mb-3">{step.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-1">{step.desc}</p>
                
                <div className="h-40 rounded-xl overflow-hidden mt-auto relative">
                  <div className="absolute inset-0 bg-brand-green-950/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
