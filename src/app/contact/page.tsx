"use client";

import React, { useState } from 'react';
import { submitInquiry } from '@/lib/inquiryService';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    product: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await submitInquiry({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        company: formData.company,
        product: formData.product,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ name: '', company: '', email: '', product: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again or use email/phone directly.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-brand-paper py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-950 mb-6">Contact Our Trade Desk</h1>
            <p className="text-brand-muted text-lg mb-10">We are a fully operational managed trade desk. Whether you need a quote or have an operational query, our team responds within 24 hours.</p>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-solid fa-location-dot text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Global Trade Hub</h3>
                  <p className="text-brand-muted">No 17, Kovalan street, 2nd main road,<br/>Uthandi Kanathur, Chennai 600119.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Email Support</h3>
                  <p className="text-brand-muted">bankingbackend.indiagreen@gmail.com<br/>bd2@igogroups.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-brand-sage rounded-full flex items-center justify-center flex-shrink-0 text-brand-green-700">
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-ink text-lg mb-1">Direct Line & WhatsApp</h3>
                  <p className="text-brand-muted">+91 73977 89803<br/>+91 73977 89804<br/>+91 73977 89805</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-brand-line">
            <h3 className="text-2xl font-bold text-brand-ink mb-6">Send an Inquiry</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                  <i className="fa-solid fa-circle-check mr-2"></i> Message sent! We will contact you soon.
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Company Name</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="Global Imports Ltd" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Email Address *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Product of Interest</label>
                <input type="text" value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="e.g. Sona Masoori Rice" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-ink mb-1">Message *</label>
                <textarea rows={4} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-brand-paper border border-brand-line rounded p-3 focus:outline-none focus:border-brand-amber transition" placeholder="Please specify quantity, destination port, etc."></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-green-950 text-white font-bold rounded hover:bg-brand-green-850 transition mt-4 disabled:opacity-70">
                {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
