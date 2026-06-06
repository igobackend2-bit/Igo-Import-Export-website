import React from 'react';

export default function TrustSignals() {
  const badges = [
    { name: "Government Recognized Exporter", icon: "fa-award" },
    { name: "IEC & GST Verified", icon: "fa-certificate" },
    { name: "Phytosanitary Compliant", icon: "fa-leaf" },
    { name: "100% Quality Assurance", icon: "fa-check-double" },
    { name: "Global Freight Partners", icon: "fa-ship" },
  ];

  return (
    <div className="bg-brand-sage py-8 border-t border-b border-brand-green-950/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3 grayscale hover:grayscale-0 transition opacity-70 hover:opacity-100 cursor-default">
              <i className={`fa-solid ${badge.icon} text-2xl text-brand-green-700`}></i>
              <span className="font-bold text-sm text-brand-ink uppercase tracking-wider">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
