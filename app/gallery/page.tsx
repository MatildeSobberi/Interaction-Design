"use client";
import React from 'react';

export default function Gallery() {
  const images = [
    { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", height: '400px' },
    { url: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800", height: '250px' },
    { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800", height: '500px' },
    { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800", height: '300px' },
    { url: "https://images.unsplash.com/photo-1620712943543-bcc46386e635?w=800", height: '450px' },
    { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", height: '350px' },
    { url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800", height: '550px' },
    { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", height: '280px' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '120px 20px' }}>
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

      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          columnCount: 3, 
          columnGap: '20px', // Distanza uguale a prima
        }}>
          {images.map((img, i) => (
            <div key={i} style={{ 
              marginBottom: '20px', // Distanza verticale tra le immagini
              breakInside: 'avoid',
              borderRadius: '15px', overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}>
              <img src={img.url} alt="AI Vision" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}