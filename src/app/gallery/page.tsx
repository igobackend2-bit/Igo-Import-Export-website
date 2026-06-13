import React from 'react';

export default function GalleryPage() {
  const photos = [
    { src: "/images/gallery_v2_container.png", title: "Container Loading" },
    { src: "/images/gallery_quality_inspection.png", title: "Quality Inspection" },
    { src: "/images/gallery_v2_farm.png", title: "Farm Sourcing" },
    { src: "/images/gallery_v2_port.png", title: "Port Logistics" },
    { src: "/images/gallery_v2_warehouse.png", title: "Warehouse Storage" },
    { src: "/images/gallery_v2_lab.png", title: "Lab Testing" },
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-4">Operations Gallery</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">A look inside our supply chain—from farms to container terminals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="group relative h-64 overflow-hidden rounded-xl border border-brand-line">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
