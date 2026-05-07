"use client";

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';

function GalleryContent() {
  const pathname = usePathname();

  const placeholderImages = Array.from({ length: 30 }, (_, i) => {
    const randomHeight = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    return {
      id: i,
      url: `https://picsum.photos/400/${randomHeight}?random=${i}`,
      height: randomHeight,
    };
  });

  const getLinkStyle = (href: string) => ({
    color: '#000', textDecoration: 'none', fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '11px', fontWeight: pathname === href ? '700' : '500',
    textTransform: 'uppercase' as const, letterSpacing: '1px', transition: 'all 0.3s ease',
    opacity: pathname === href ? 1 : 0.5, display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', gap: '4px'
  });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '120px 20px' }}>
      <nav style={{ 
        position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        padding: '12px 35px', borderRadius: '40px', background: 'rgba(255, 255, 255, 0.7)', 
        border: '1px solid rgba(0, 0, 0, 0.08)', backdropFilter: 'blur(15px)', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', width: 'fit-content'
      }}>
        <a href="/about-us" style={getLinkStyle('/about-us')}>About Us {pathname === '/about-us' && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}</a>
        <a href="/about-you" style={getLinkStyle('/about-you')}>About You {pathname === '/about-you' && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}</a>
        <a href="/" style={{ color: '#000', display: 'flex', alignItems: 'center', margin: '0 10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
        </a>
        <a href="/gallery" style={getLinkStyle('/gallery')}>Gallery {pathname === '/gallery' && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}</a>
        <a href="/feedback" style={getLinkStyle('/feedback')}>Feedback {pathname === '/feedback' && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}</a>
      </nav>

      <section style={{ maxWidth: '1200px', margin: '0 auto', columnCount: 4, columnGap: '15px' }}>
        {placeholderImages.map((image) => (
          <div key={image.id} style={{ display: 'inline-block', width: '100%', marginBottom: '15px', borderRadius: '16px', overflow: 'hidden', breakInside: 'avoid', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <img src={image.url} alt="AI Art" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        ))}
      </section>
    </main>
  );
}

export default function GalleryPage() {
  return <Suspense fallback={null}><GalleryContent /></Suspense>;
}