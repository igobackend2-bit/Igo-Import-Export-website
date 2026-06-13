"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleQuantityChange = (id: string, q: number) => {
    updateQuantity(id, q);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const uniqueId = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);
      const orderData = {
        orderId: uniqueId,
        customerName: formData.customerName,
        customerEmail: formData.email, // matches interface
        companyName: formData.companyName,
        phone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.country}`, // matches interface
        notes: formData.notes,
        items: items.map(item => ({ // matches interface
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: 0 // "Quote on Request" usually, but schema expects number
        })),
        totalAmount: 0, // matches interface
        status: 'pending', // matches OrderStatus lowercase
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      setOrderId(uniqueId);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order: ", error);
      alert("There was an issue creating your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-brand-paper py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white p-12 rounded-2xl shadow-xl border border-brand-line">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <i className="fa-solid fa-check"></i>
            </div>
            <h1 className="text-3xl font-serif font-bold text-brand-green-950 mb-2">Order Placed Successfully!</h1>
            <p className="text-brand-muted mb-6">Your order ID is <strong className="text-brand-ink">{orderId}</strong></p>
            <p className="text-brand-muted mb-8">Our team will review your requirements and provide a quote shortly.</p>
            <Link href="/hub/agriculture" className="inline-block px-8 py-3 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition">
              Continue Sourcing
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-paper py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-serif font-bold text-brand-green-950 mb-8">Your Cart & Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-line">
                <h2 className="text-xl font-bold text-brand-ink">Items ({totalItems})</h2>
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">
                    Clear Cart
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10">
                  <i className="fa-solid fa-cart-arrow-down text-4xl text-brand-line mb-4"></i>
                  <p className="text-brand-muted mb-6">Your cart is empty.</p>
                  <Link href="/hub/agriculture" className="px-6 py-2 bg-brand-green-950 text-white font-bold rounded hover:bg-brand-green-850 transition">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center border border-brand-line p-4 rounded-xl">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-ink">{item.name}</h3>
                        <p className="text-sm text-brand-muted">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 text-brand-ink flex items-center justify-center hover:bg-gray-200 transition">
                          <i className="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 text-brand-ink flex items-center justify-center hover:bg-gray-200 transition">
                          <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 ml-2 transition">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-8 sticky top-24">
              <h2 className="text-xl font-bold text-brand-ink mb-6 pb-4 border-b border-brand-line">Shipping Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-ink mb-1">Customer Name *</label>
                    <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-ink mb-1">Company Name</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-ink mb-1">Email *</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-ink mb-1">Phone *</label>
                    <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Address *</label>
                  <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Country *</label>
                  <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-ink mb-1">Order Notes</label>
                  <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-brand-line rounded p-2.5 text-sm focus:outline-none focus:border-brand-green-500"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting || items.length === 0} className="w-full mt-6 py-3 bg-brand-green-950 text-white font-bold rounded hover:bg-brand-green-850 transition shadow-md disabled:opacity-50">
                  {isSubmitting ? 'Processing...' : 'Place Order Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
