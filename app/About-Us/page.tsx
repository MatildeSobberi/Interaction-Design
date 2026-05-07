"use client";

import React from 'react';

export default function AboutUs() {
  const linkStyle = { 
    color: '#000', 
    textDecoration: 'none', 
    fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9', // Un grigio quasi bianco, molto riposante
      fontFamily: 'var(--font-roboto), sans-serif',
      color: '#000',
      padding: '120px 20px 60px 20px' // Spazio per la navbar in alto
    }}>
      
      {/* NAVBAR (Consistente con la Home) */}
      <nav style={{ 
        position: 'fixed', top: '25px', left: '30px', right: '30px', zIndex: 100,
        padding: '12px 40px', borderRadius: '40px',
        background: 'rgba(230, 230, 230, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <a href="/" style={linkStyle}>Home</a>
        <div style={{flexGrow: 1, height: '1px', background: '#000', margin: '0 25px', opacity: 0.1}}></div>
        <a href="/about-you" style={linkStyle}>About You</a>
        <div style={{flexGrow: 1, height: '1px', background: '#000', margin: '0 25px', opacity: 0.1}}></div>
        <a href="/gallery" style={linkStyle}>Gallery</a>
        <div style={{flexGrow: 1, height: '1px', background: '#000', margin: '0 25px', opacity: 0.1}}></div>
        <a href="/feedback" style={linkStyle}>Feedback</a>
      </nav>

      {/* CONTENUTO PRINCIPALE */}
      <section style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-1px' }}>
          About Us
        </h1>
        
        <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>
          <p style={{ marginBottom: '25px' }}>
            Benvenuti in <strong>A.I. Curiosity</strong>. Siamo un team di esploratori digitali 
            interessati al confine tra tecnologia e percezione umana. 
          </p>
          
          <p style={{ marginBottom: '25px' }}>
            Questo progetto nasce da una domanda semplice ma profonda: 
            <em> "Cosa succederebbe se un'intelligenza artificiale non si limitasse a rispondere, ma iniziasse a fare domande?"</em>
          </p>

          <div style={{ 
            marginTop: '60px', padding: '30px', borderLeft: '4px solid #000', backgroundColor: '#fff' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>La nostra Visione</h3>
            <p>Vogliamo trasformare la fredda computazione dei dati in un'esperienza visiva e poetica, 
            mappando la curiosità umana e artificiale attraverso le parole.</p>
          </div>
        </div>

        {/* Bottone per tornare alla mappa */}
        <div style={{ marginTop: '80px' }}>
          <a href="/" style={{
            padding: '15px 30px', background: '#000', color: '#fff', 
            textDecoration: 'none', borderRadius: '5px', fontWeight: '700'
          }}>
            Torna alla Mappa
          </a>
        </div>
      </section>

    </main>
  );
}