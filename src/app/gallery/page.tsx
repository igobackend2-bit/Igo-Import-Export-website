import React from 'react';

export default function GalleryPage() {
  const photos = [
    { src: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80", title: "Container Loading" },
    { src: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80", title: "Quality Inspection" },
    { src: "https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=600&q=80", title: "Farm Sourcing" },
    { src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&q=80", title: "Port Logistics" },
    { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80", title: "Warehouse Storage" },
    { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80", title: "Lab Testing" },
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
              <div className="absolute inset-0 bg-brand-green-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-wider">{photo.title}</span>
              </div>
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
