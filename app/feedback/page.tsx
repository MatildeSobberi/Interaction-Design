"use client";
import React, { useState } from 'react';

export default function Feedback() {
  const [pensiero, setPensiero] = useState('');
  const [inviato, setInviato] = useState(false);

  const handleInvia = () => {
    if (pensiero.trim().length > 5) {
      // Qui in futuro potremo collegarlo a una tabella "commenti" su Supabase
      setInviato(true);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'var(--font-roboto), sans-serif', padding: '120px 20px' }}>
      
      {/* NAVBAR */}
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
        <a href="/gallery" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.4 }}>Gallery</a>
        <a href="/feedback" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          Feedback
          <div style={{ width: '4px', height: '4px', background: '#000', borderRadius: '50%' }} />
        </a>
      </nav>

      <section style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
        {!inviato ? (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>Cosa hai provato esplorando questa mappa?</h1>
            <p style={{ color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
              Questo progetto nasce per osservare come l'uomo interagisce con una curiosità artificiale. 
              Il tuo pensiero ci aiuta a capire se siamo riusciti a creare una connessione.
            </p>
            
            <textarea 
              value={pensiero}
              onChange={(e) => setPensiero(e.target.value)}
              placeholder="Scrivi qui la tua esperienza..."
              style={{
                width: '100%', height: '200px', padding: '20px', borderRadius: '15px',
                border: '1px solid #eee', backgroundColor: '#fdfdfd', fontSize: '16px',
                fontFamily: 'serif', fontStyle: 'italic', resize: 'none', outline: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
              }}
            />

            <button 
              onClick={handleInvia}
              style={{
                marginTop: '30px', padding: '15px 40px', borderRadius: '30px',
                backgroundColor: '#000', color: '#fff', border: 'none',
                fontWeight: '700', cursor: 'pointer', opacity: pensiero.length > 5 ? 1 : 0.3,
                transition: 'all 0.3s'
              }}>
              Invia il tuo pensiero
            </button>
          </>
        ) : (
          <div style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Grazie per aver condiviso.</h2>
            <p style={{ marginTop: '20px', color: '#666' }}>Il tuo contributo è stato registrato nel nostro archivio delle esperienze.</p>
            <a href="/" style={{ display: 'inline-block', marginTop: '30px', color: '#000', fontWeight: '700' }}>Torna alla mappa</a>
          </div>
        )}
      </section>
    </main>
  );
}