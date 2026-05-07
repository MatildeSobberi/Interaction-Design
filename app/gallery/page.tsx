"use client";
import React from 'react';

export default function Gallery() {
  // Esempio di immagini (puoi sostituire i link con le tue foto su Supabase o Unsplash)
  const images = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
    "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1000",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000"
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'var(--font-roboto), sans-serif', padding: '120px 20px' }}>
      
      {/* NAVBAR COORDINATA */}
      <nav style={{ 
        position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        padding: '12px 35px', borderRadius: '40px',
        background: 'rgba(240, 240, 240, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '25px', width: 'fit-content'
      }}>
        <a href="/about-us" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.4 }}>About Us</a>
        <a href="/about-you" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.4 }}>About You</a>
        <a href="/" style={{ color: '#000', margin: '0 10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </a>
        <a href="/gallery" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          Gallery
          <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />
        </a>
        <a href="/feedback" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.4 }}>Feedback</a>
      </nav>

      {/* GRID GALLERY */}
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '40px', textAlign: 'center' }}>Visual Archive</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {images.map((img, i) => (
            <div key={i} style={{ 
              height: '300px', backgroundColor: '#ddd', borderRadius: '15px', overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <img src={img} alt="AI Vision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}