"use client";

import React from 'react';
import { usePathname } from 'next/navigation'; // Importante per l'evidenziazione

export default function AboutUs() {
  const pathname = usePathname();

  const navItems = [
    { label: 'About Us', href: '/about-us' },
    { label: 'About You', href: '/about-you' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Feedback', href: '/feedback' }
  ];

  const getLinkStyle = (href: string) => ({
    color: '#000',
    textDecoration: 'none',
    fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    borderBottom: pathname === href ? '2px solid #000' : '2px solid transparent', // Evidenziatore
    paddingBottom: '4px',
    transition: 'all 0.3s ease',
    opacity: pathname === href ? 1 : 0.5 // Più chiaro se non attivo
  });

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '120px 20px' }}>
      
      {/* NAVBAR CON EVIDENZIAZIONE */}
      <nav style={{ 
        position: 'fixed', top: '25px', left: '30px', right: '30px', zIndex: 100,
        padding: '12px 40px', borderRadius: '40px',
        background: 'rgba(230, 230, 230, 0.9)', backdropFilter: 'blur(12px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        {/* Tasto Mappa per tornare Home */}
        <a href="/" style={{ fontSize: '20px', textDecoration: 'none' }}>📍</a>
        
        <div style={{ flexGrow: 1, height: '1px', background: '#000', margin: '0 20px', opacity: 0.1 }}></div>

        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <a href={item.href} style={getLinkStyle(item.href)}>{item.label}</a>
            {index < navItems.length - 1 && (
              <div style={{ flexGrow: 1, height: '1px', background: '#000', margin: '0 20px', opacity: 0.1 }}></div>
            )}
          </React.Fragment>
        ))}
      </nav>

      <section style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-roboto)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700' }}>About Us</h1>
        <p style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.6' }}>
          Il tuo testo descrittivo qui...
        </p>
      </section>
    </main>
  );
}