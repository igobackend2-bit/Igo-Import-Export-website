import React from 'react';
import TrustSignals from '@/components/home/TrustSignals';

export default function CertificatesPage() {
  const certs = [
    { title: "IEC Certificate", desc: "Mandatory Import Export Code issued by DGFT.", icon: "fa-file-invoice" },
    { title: "GST Certificate", desc: "Tax Compliance and business registration in India.", icon: "fa-building-columns" },
    { title: "APEDA RCMC", desc: "Required for exporting scheduled agricultural products.", icon: "fa-seedling" },
    { title: "FSSAI License", desc: "Food Safety and Standards Authority of India compliance.", icon: "fa-shield-halved" },
    { title: "Phytosanitary Certificate", desc: "Ensuring agricultural exports are free of pests.", icon: "fa-microscope" },
    { title: "Fumigation Certificate", desc: "Pest control compliance for sea freight & packaging.", icon: "fa-spray-can" },
    { title: "Spices Board RCMC", desc: "Mandatory for the export of Indian spices.", icon: "fa-pepper-hot" },
    { title: "Certificate of Origin", desc: "Official document establishing the origin of goods.", icon: "fa-earth-americas" },
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-4">Export Certifications</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">We maintain strict adherence to international trade laws, ensuring your goods clear customs without delay.</p>
        </div>
        
        <TrustSignals />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {certs.map((cert, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-brand-line shadow-sm hover:shadow-xl transition">
              <div className="h-40 bg-brand-green-50 rounded-lg mb-4 flex items-center justify-center border border-brand-green-100 text-brand-green-800">
                 <i className={`fa-solid ${cert.icon} text-5xl`}></i>
              </div>
              <h3 className="font-bold text-brand-ink mb-2">{cert.title}</h3>
              <p className="text-sm text-brand-muted">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
