import React from 'react';

export default function EventsPage() {
  const events = [
    { name: "Gulfood 2026", location: "Dubai, UAE", date: "Feb 16-20, 2026", status: "Upcoming", desc: "Meet the IGO team at the world's largest annual food & beverage trade exhibition." },
    { name: "Anuga 2025", location: "Cologne, Germany", date: "Oct 11-15, 2025", status: "Past", desc: "Showcasing our premium 'Farmers Factory' FMCG range to European buyers." },
    { name: "World Food India", location: "New Delhi, India", date: "Nov 3-5, 2025", status: "Past", desc: "Connecting with domestic and international agricultural stakeholders." }
  ];

  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-4">Trade & Events</h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">Meet the IGO trade desk team at major global exhibitions and commodity summits.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {events.map((ev, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-line mb-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-brand-ink">{ev.name}</h2>
                  {ev.status === 'Upcoming' ? (
                    <span className="px-2 py-1 bg-brand-amber text-brand-ink text-xs font-bold rounded">Upcoming</span>
                  ) : (
                    <span className="px-2 py-1 bg-brand-sage text-brand-muted text-xs font-bold rounded">Past Event</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-brand-muted mb-4 font-medium">
                  <span><i className="fa-solid fa-location-dot mr-1 text-brand-green-700"></i> {ev.location}</span>
                  <span><i className="fa-solid fa-calendar mr-1 text-brand-green-700"></i> {ev.date}</span>
                </div>
                <p className="text-brand-ink/80">{ev.desc}</p>
              </div>
              <div className="md:w-48 text-right">
                <button className="px-6 py-2 border border-brand-green-950 text-brand-green-950 font-bold rounded hover:bg-brand-green-50 transition w-full md:w-auto">
                  {ev.status === 'Upcoming' ? 'Book a Meeting' : 'View Highlights'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
