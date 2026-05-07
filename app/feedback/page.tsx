"use client";

import React, { useState } from 'react';
import { supabase } from '../supabase'; // Assicurati che il percorso sia corretto

export default function Feedback() {
  const [parola, setParola] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Inviando...');

    const { error } = await supabase
      .from('segnalazioni')
      .insert([
        { 
          parola: parola, 
          lat: parseFloat(lat), 
          lng: parseFloat(lng),
          frequenza: 1 
        }
      ]);

    if (error) {
      console.error(error);
      setStatus('Errore durante l\'invio.');
    } else {
      setStatus('Grazie! La tua parola è stata aggiunta alla mappa.');
      setParola('');
      setLat('');
      setLng('');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '16px'
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

      <section style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>Lascia il tuo segno</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Aggiungi una parola alla curiosità dell'IA.</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Parola</label>
          <input 
            type="text" 
            placeholder="Es: Silenzio" 
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            style={inputStyle} 
            required 
          />

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Latitudine</label>
              <input 
                type="number" 
                step="any"
                placeholder="41.89" 
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                style={inputStyle} 
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Longitudine</label>
              <input 
                type="number" 
                step="any"
                placeholder="12.49" 
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                style={inputStyle} 
                required 
              />
            </div>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}>
            Invia alla mappa
          </button>
        </form>

        {status && <p style={{ marginTop: '20px', fontWeight: '500', color: status.includes('Errore') ? 'red' : 'green' }}>{status}</p>}
      </section>
    </main>
  );
}