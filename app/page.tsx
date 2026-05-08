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
  
  // Stati per la gestione del caricamento e dell'interazione
  const [hasInteracted, setHasInteracted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Controlla se l'utente ha già interagito in questa sessione
    const giaVisto = sessionStorage.getItem('visto');
    if (!giaVisto) {
      setHasInteracted(false);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const caricaDati = async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      if (data) setPunti(data);
    };
    caricaDati();

    if (map.current || !mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2,
      projection: { name: 'mercator' }
    });

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      sessionStorage.setItem('visto', 'true');
    };

    // Eventi che nascondono il titolo
    map.current.on('zoomstart', handleFirstInteraction);
    map.current.on('mousedown', handleFirstInteraction);
    map.current.on('touchstart', handleFirstInteraction);
    map.current.on('zoom', () => setCurrentZoom(map.current.getZoom()));
  }, [isMobile, isClient]);

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

  // Se non siamo sul client, mostriamo uno sfondo bianco vuoto per evitare flash di errore
  if (!isClient) return <div style={{ backgroundColor: '#fff', width: '100vw', height: '100vh' }} />;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {/* Overlay e Titolo - Appare solo se non si è interagito */}
      {!hasInteracted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 4, pointerEvents: 'none',
          transition: 'opacity 0.8s ease', 
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', width: '90%'
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '54px', 
              fontWeight: '700', 
              color: '#000', 
              marginBottom: '15px', 
              lineHeight: '1.2',
              maxWidth: '950px',
              margin: '0 auto'
            }}>
              Is A.I. ever going to be able to understand the value of human experience when travelling?
            </h1>
            <p style={{ 
              fontSize: isMobile ? '16px' : '22px', 
              color: '#333', 
              fontStyle: 'italic', 
              fontFamily: 'serif', 
              marginTop: '25px' 
            }}>
              Tap and zoom in the map
            </p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ 
        position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
        padding: '12px 35px', borderRadius: '40px',
        background: hasInteracted ? 'rgba(230, 230, 230, 0.7)' : 'transparent',
        border: hasInteracted ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
        backdropFilter: hasInteracted ? 'blur(12px)' : 'none',
        transition: 'all 0.8s ease', display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: isMobile ? '15px' : '25px', width: 'fit-content', whiteSpace: 'nowrap'
      }}>
        <a href="/about-us" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>About Us</a>
        <a href="/about-you" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>About You</a>
        
        <a href="/" style={{ color: '#000', display: 'flex', alignItems: 'center', margin: '0 10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </a>

        <a href="/gallery" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>Gallery</a>
        <a href="/feedback" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>Feedback</a>
      </nav>

      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </main>
  );
}