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
  
  const [hasInteracted, setHasInteracted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

    map.current.on('zoomstart', handleFirstInteraction);
    map.current.on('mousedown', handleFirstInteraction);
    map.current.on('touchstart', handleFirstInteraction);
    map.current.on('zoom', () => setCurrentZoom(map.current.getZoom()));
  }, [isMobile, isClient]);

  useEffect(() => {
    if (!map.current) return;
    document.querySelectorAll('.custom-marker').forEach(m => m.remove());
    if (currentZoom < 4) return;

    // Raggruppiamo i punti per coordinate esatte
    const coordinateGroups = punti.reduce((groups, punto) => {
      const key = `${punto.lng},${punto.lat}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(punto);
      return groups;
    }, {});

    // Iteriamo su ogni gruppo di coordinate
    Object.keys(coordinateGroups).forEach(key => {
      const groupPunti = coordinateGroups[key];
      const [lng, lat] = key.split(',').map(Number);
      
      // Ordiniamo le parole del gruppo per frequenza decrescente (opzionale)
      groupPunti.sort((a, b) => b.frequenza - a.frequenza);

      groupPunti.forEach((punto, index) => {
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
        el.style.position = 'absolute';
        el.style.whiteSpace = 'nowrap';

        // --- NUOVA LOGICA A RAGGIERA ---
        
        let offsetX = 0;
        let offsetY = 0;

        if (index > 0) { // Il primo marker rimane al centro
          // Parametri della raggiera
          const itemsPerCircle = 8; // Numero di parole per ogni cerchio concentrico
          const baseRadius = isMobile ? 40 : 60; // Raggio del primo cerchio in pixel
          const radiusIncrement = isMobile ? 25 : 35; // Quanto si allarga ogni cerchio successivo

          // Calcoliamo in quale cerchio si trova la parola attuale
          const circleIndex = Math.floor((index - 1) / itemsPerCircle);
          
          // Calcoliamo l'angolo per questa parola all'interno del suo cerchio
          const indexInCircle = (index - 1) % itemsPerCircle;
          const angle = (indexInCircle / itemsPerCircle) * 2 * Math.PI; // Angolo in radianti

          // Calcoliamo il raggio attuale per questo cerchio
          const currentRadius = baseRadius + (circleIndex * radiusIncrement);

          // Trigonometria per convertire raggio e angolo in coordinate X e Y
          offsetX = currentRadius * Math.cos(angle);
          offsetY = currentRadius * Math.sin(angle);
        }

        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setOffset([offsetX, offsetY]) // Applichiamo l'offset calcolato
          .addTo(map.current);
      });
    });

  }, [punti, currentZoom, isMobile]);

  if (!isClient) return <div style={{ backgroundColor: '#fff', width: '100vw', height: '100vh' }} />;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {!hasInteracted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 4, pointerEvents: 'none',
          transition: 'opacity 0.8s ease', 
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', width: '95%' 
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '60px', 
              fontWeight: '700', 
              color: '#000', 
              marginBottom: '15px', 
              lineHeight: '1.2',
              maxWidth: '1100px', 
              margin: '0 auto',
              whiteSpace: 'normal'
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