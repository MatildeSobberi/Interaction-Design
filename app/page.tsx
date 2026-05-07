"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from './supabase';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function HomePage() {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [punti, setPunti] = useState<any[]>([]);
  const [currentZoom, setCurrentZoom] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Per evitare il "flash" del titolo

  useEffect(() => {
    // 1. Controllo immediato della memoria
    const giaVisto = localStorage.getItem('hasInteracted');
    if (giaVisto === 'true') {
      setHasInteracted(true);
    }
    setIsLoading(false); // Ora sappiamo se mostrare o no il titolo

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const caricaDati = async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      if (data) setPunti(data);
    };
    caricaDati();

    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2,
      projection: { name: 'mercator' }
    });

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      localStorage.setItem('hasInteracted', 'true');
    };

    map.current.on('zoomstart', handleFirstInteraction);
    map.current.on('mousedown', handleFirstInteraction);
    map.current.on('touchstart', handleFirstInteraction);
    map.current.on('zoom', () => setCurrentZoom(map.current.getZoom()));
  }, [isMobile]);

  useEffect(() => {
    if (!map.current) return;
    document.querySelectorAll('.custom-marker').forEach(m => m.remove());
    if (currentZoom < 4) return;

    punti.forEach((punto) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerText = punto.parola;
      el.style.fontFamily = 'var(--font-roboto), sans-serif';
      el.style.background = 'rgba(255, 255, 255, 0.6)';
      el.style.padding = isMobile ? '4px 10px' : '8px 15px';
      el.style.borderRadius = '20px';
      el.style.color = '#000';
      const baseSize = isMobile ? 10 : 14;
      el.style.fontSize = `${baseSize + (punto.frequenza * (isMobile ? 1.5 : 3))}px`;
      el.style.fontWeight = 'bold';
      el.style.backdropFilter = 'blur(4px)';
      new mapboxgl.Marker(el).setLngLat([punto.lng, punto.lat]).addTo(map.current);
    });
  }, [punti, currentZoom, isMobile]);

  const navLinkStyle = {
    color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500',
    textTransform: 'uppercase' as const, letterSpacing: '1px', opacity: 0.6
  };

  // Se stiamo ancora controllando la memoria, non renderizziamo nulla sopra la mappa
  if (isLoading) return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {/* Overlay e Titolo appaiono SOLO se non c'è stata interazione */}
      {!hasInteracted && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 4, pointerEvents: 'none',
            backdropFilter: 'blur(2px)'
          }} />

          <div style={{
            position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 5, textAlign: 'center', width: '90%', pointerEvents: 'none'
          }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '60px', fontWeight: '700', color: '#000', marginBottom: '15px', lineHeight: '1.2' }}>
              What if A.I. started with a question,<br /> 
              being curious about the world?<br /> 
              But it could never <span style={{ fontStyle: 'italic' }}>trully</span> learn?
            </h1>
            <p style={{ fontSize: isMobile ? '16px' : '24px', color: '#333', fontStyle: 'italic', fontFamily: 'serif', marginTop: '20px' }}>
              Tap and zoom in the map
            </p>
          </div>
        </>
      )}

      {/* NAVBAR SEMPRE VISIBILE */}
      <nav style={{ 
        position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
        padding: '12px 35px', borderRadius: '40px',
        background: hasInteracted ? 'rgba(230, 230, 230, 0.7)' : 'transparent',
        border: hasInteracted ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
        backdropFilter: hasInteracted ? 'blur(12px)' : 'none',
        transition: 'all 0.8s ease', display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: isMobile ? '15px' : '25px', width: 'fit-content', whiteSpace: 'nowrap'
      }}>
        <a href="/about-us" style={navLinkStyle}>About Us</a>
        <a href="/about-you" style={navLinkStyle}>About You</a>

        <a href="/" style={{ color: '#000', display: 'flex', alignItems: 'center', margin: '0 10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </a>

        <a href="/gallery" style={navLinkStyle}>Gallery</a>
        <a href="/feedback" style={navLinkStyle}>Feedback</a>
      </nav>

      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}