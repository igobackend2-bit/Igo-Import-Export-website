/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export default function UpcomingEvents() {
  const events = [
    {
      name: "Gulfood 2026",
      location: "Dubai World Trade Centre",
      date: "Feb 16-20, 2026",
      image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=600&q=80",
      tag: "Upcoming"
    },
    {
      name: "Anuga 2025",
      location: "Cologne, Germany",
      date: "Oct 11-15, 2025",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
      tag: "Past"
    },
    {
      name: "World Food India",
      location: "New Delhi, India",
      date: "Nov 3-5, 2025",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
      tag: "Past"
    }
  ];

  return (
    <section className="py-16 bg-brand-paper">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-brand-green-950 mb-2">Agri-Exhibitions & Events</h2>
          <p className="text-brand-muted max-w-2xl mx-auto">Meet the IGO trade desk team at major global commodity summits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-brand-line group">
              <div className="h-48 relative overflow-hidden">
                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 right-4 bg-brand-green-950 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                  {ev.tag}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-brand-ink text-xl mb-3">{ev.name}</h3>
                <div className="flex flex-col gap-2 text-sm text-brand-muted mb-4">
                  <span><i className="fa-solid fa-location-dot w-5 text-brand-green-700"></i> {ev.location}</span>
                  <span><i className="fa-solid fa-calendar w-5 text-brand-green-700"></i> {ev.date}</span>
                </div>
                <Link href="/events" className="text-brand-amber font-bold text-sm hover:text-brand-green-950 transition">
                  {ev.tag === 'Upcoming' ? 'Book a Meeting' : 'View Highlights'} <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
