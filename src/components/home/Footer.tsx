/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white pt-20 pb-10 border-t-4 border-brand-amber">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
              <div className="bg-brand-amber text-brand-ink font-bold text-2xl px-2 py-1 rounded">IGO</div>
              <div className="flex flex-col">
                <strong className="text-lg leading-tight text-white">IGO Import & Export</strong>
                <span className="text-xs text-brand-amber">Managed Trade Desk</span>
              </div>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              We are not a directory. IGO is India's premier managed trade desk, providing end-to-end sourcing, quality inspection, documentation, and global freight for international buyers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-amber hover:text-brand-ink transition"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-amber hover:text-brand-ink transition"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-amber hover:text-brand-ink transition"><i className="fa-brands fa-facebook-f"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-lg font-bold mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              <li><Link href="#home" className="hover:text-brand-amber transition">Home</Link></li>
              <li><Link href="#about" className="hover:text-brand-amber transition">About Us</Link></li>
              <li><Link href="#services" className="hover:text-brand-amber transition">Our Services</Link></li>
              <li><Link href="#products" className="hover:text-brand-amber transition">Export Catalog</Link></li>
              <li><Link href="#rfq" className="hover:text-brand-amber transition">Send RFQ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 font-serif">Trade Services</h4>
            <ul className="space-y-3 text-white/70">
              <li><Link href="#" className="hover:text-brand-amber transition">Verified Sourcing</Link></li>
              <li><Link href="#" className="hover:text-brand-amber transition">Quality Inspection</Link></li>
              <li><Link href="#" className="hover:text-brand-amber transition">Export Documentation</Link></li>
              <li><Link href="#" className="hover:text-brand-amber transition">FOB & CIF Logistics</Link></li>
              <li><Link href="#" className="hover:text-brand-amber transition">Private Labeling</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-6 font-serif">Contact Desk</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-brand-amber"></i>
                <span>No 17, Kovalan street, 2nd main road,<br/>Uthandi Kanathur, Chennai 600119.</span>
              </li>
              <li className="flex gap-3 items-start">
                <i className="fa-solid fa-envelope text-brand-amber mt-1"></i>
                <span>bankingbackend.indiagreen@gmail.com<br/>bd2@igogroups.com</span>
              </li>
              <li className="flex gap-3 items-start">
                <i className="fa-solid fa-phone text-brand-amber mt-1"></i>
                <span>+91 73977 89803<br/>+91 73977 89804<br/>+91 73977 89805</span>
              </li>
              <li className="flex gap-3 items-center text-green-400">
                <i className="fa-brands fa-whatsapp"></i>
                <span>24/7 WhatsApp Support</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} IGO Import & Export. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Trade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

