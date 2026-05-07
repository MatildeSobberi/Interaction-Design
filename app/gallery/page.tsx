"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function GalleryPage() {
  const pathname = usePathname();

  // Generiamo 30 segnaposto con altezze casuali per simulare l'effetto Masonry
  // In produzione, sostituirai questi con i link reali delle tue immagini
  const placeholderImages = Array.from({ length: 30 }, (_, i) => {
    // Genera un'altezza casuale tra 200px e 500px
    const randomHeight = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    return {
      id: i,
      url: `https://via.placeholder.com/400x${randomHeight}.webp?text=AI+Art+${i + 1}`,
      height: randomHeight,
    };
  });

  const navItems = [
    { label: 'About Us', href: '/about-us' },
    { label: 'About You', href: '/about-you' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Feedback', href: '/feedback' }
  ];

  // Stile dinamico per i link della Navbar
  const getLinkStyle = (href: string) => ({
    color: '#000',
    textDecoration: 'none',
    fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '11px',
    fontWeight: pathname === href ? '700' : '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    opacity: pathname === href ? 1 : 0.5, // Meno opaco se non attivo
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px' // Spazio tra testo e pallino
  });

  // Icona della Mappa stilizzata (SVG)
  const MapIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '120px 20px' }}>
      
      {/* NAVBAR STILIZZATA (Fissa in alto) */}
      <nav style={{ 
        position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        padding: '12px 35px', borderRadius: '40px',
        background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '25px', width: 'fit-content', whiteSpace: 'nowrap' as const
      }}>
        
        {/* Gruppo Sinistra (About) */}
        <a href={navItems[0].href} style={getLinkStyle(navItems[0].href)}>
          {navItems[0].label}
          {pathname === navItems[0].href && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}
        </a>
        <a href={navItems[1].href} style={getLinkStyle(navItems[1].href)}>
          {navItems[1].label}
          {pathname === navItems[1].href && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}
        </a>

        {/* ICONA MAPPA CENTRALE */}
        <a href="/" style={{ color: '#000', display: 'flex', alignItems: 'center', margin: '0 10px' }}>
          <MapIcon />
        </a>

        {/* Gruppo Destra (Gallery/Feedback) */}
        <a href={navItems[2].href} style={getLinkStyle(navItems[2].href)}>
          {navItems[2].label}
          {pathname === navItems[2].href && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}
        </a>
        <a href={navItems[3].href} style={getLinkStyle(navItems[3].href)}>
          {navItems[3].label}
          {pathname === navItems[3].href && <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />}
        </a>
      </nav>

      {/* TITOLO PAGINA (Opzionale) */}
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-roboto)', fontWeight: '700', fontSize: '32px', marginBottom: '50px' }}>
        Visual Archive
      </h1>

      {/* CONTENITORE GALLERY MASONRY (Pinterest Style) */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        columnCount: 4, // Numero di colonne (puoi aumentarlo o diminuirlo)
        columnGap: '15px', // Spazio orizzontale tra le colonne
      }}>
        {placeholderImages.map((image) => (
          <div key={image.id} style={{
            display: 'inline-block',
            width: '100%', // Occupa tutta la larghezza della colonna
            marginBottom: '15px', // Spazio verticale tra le immagini
            borderRadius: '16px', // Angoli arrotondati come Pinterest
            overflow: 'hidden', // Ritaglia l'immagine per gli angoli
            background: '#f0f0f0', // Segnaposto grigio mentre carica
            breakInside: 'avoid', // Impedisce che un'immagine si spezzi tra due colonne
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
          // Semplice effetto hover
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
          }}
          >
            <img 
              src={image.url} 
              alt={`AI Generated Art ${image.id + 1}`} 
              style={{
                width: '100%',
                height: 'auto', // Mantiene la proporzione
                display: 'block',
                loading: 'lazy' // Carica l'immagine solo quando appare nello schermo
              }}
            />
          </div>
        ))}
      </section>

    </main>
  );
}