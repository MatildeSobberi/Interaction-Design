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

  // Controllo per vedere se l'utente è da Mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const caricaDati = async () => {
    const { data } = await supabase.from('segnalazioni').select('*');
    if (data) setPunti(data);
  };

  useEffect(() => {
    caricaDati();
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2, // Zoom più lontano su mobile per vedere tutto
      projection: { name: 'mercator' }
    });

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      map.current.off('zoomstart', handleFirstInteraction);
      map.current.off('mousedown', handleFirstInteraction);
      map.current.off('touchstart', handleFirstInteraction);
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
      el.style.padding = isMobile ? '4px 10px' : '8px 15px'; // Padding ridotto su mobile
      el.style.borderRadius = '20px';
      el.style.color = '#000';
      const baseSize = isMobile ? 10 : 14; // Font più piccolo su mobile
      el.style.fontSize = `${baseSize + (punto.frequenza * (isMobile ? 1.5 : 3))}px`;
      el.style.fontWeight = 'bold';
      el.style.backdropFilter = 'blur(4px)';
      new mapboxgl.Marker(el).setLngLat([punto.lng, punto.lat]).addTo(map.current);
    });
  }, [punti, currentZoom, isMobile]);

  const navItems = [
    { label: 'About Us', href: '/about-us' },
    { label: 'About You', href: '/about-you' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Feedback', href: '/feedback' }
  ];

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 4, pointerEvents: 'none',
        transition: 'opacity 1s ease', opacity: hasInteracted ? 0 : 1,
        visibility: hasInteracted ? 'hidden' : 'visible', backdropFilter: 'blur(2px)'
      }} />

{/* NAVBAR RESPONSIVE AGGIORNATA */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '10px' : '25px',
        left: isMobile ? '10px' : '30px',
        right: isMobile ? '10px' : '30px',
        zIndex: 10,
        padding: isMobile ? '10px 15px' : '12px 40px',
        borderRadius: '40px',
        background: hasInteracted ? 'rgba(230, 230, 230, 0.8)' : 'transparent',
        backdropFilter: hasInteracted ? 'blur(12px)' : 'none',
        transition: 'all 0.8s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* ICONA MAPPA - REFRESH */}
        <a href="/" style={{ fontSize: '20px', textDecoration: 'none', cursor: 'pointer' }}>📍</a>
        
        <div style={{ flexGrow: 1, height: '1px', background: '#000', margin: '0 20px', opacity: 0.1 }}></div>

        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <a href={item.href} style={{
              color: '#000', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase',
              fontSize: isMobile ? '10px' : '13px', whiteSpace: 'nowrap'
            }}>{item.label}</a>
            
            {index < navItems.length - 1 && (
              <div style={{
                flexGrow: 1, height: '1px', background: '#000', 
                margin: isMobile ? '0 8px' : '0 25px', opacity: 0.1,
                display: isMobile ? 'none' : 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: '5px', height: '5px', background: '#000', borderRadius: '50%' }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* MESSAGGIO CENTRALE RESPONSIVE */}
      <div style={{
        position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 5, textAlign: 'center', width: '90%',
        transition: 'all 0.8s ease', opacity: hasInteracted ? 0 : 1,
        visibility: hasInteracted ? 'hidden' : 'visible', pointerEvents: 'none'
      }}>
        <h1 style={{ 
          fontSize: isMobile ? '28px' : '60px', // Testo molto più piccolo su mobile
          fontWeight: '700', color: '#000', marginBottom: '15px', lineHeight: '1.2',
        }}>
          What if A.I. started with a question,<br /> 
          being curious about the world?<br /> 
          But it could never <span style={{ fontStyle: 'italic' }}>trully</span> learn?
        </h1>

        <p style={{ 
          fontSize: isMobile ? '16px' : '24px', 
          color: '#333', fontStyle: 'italic', fontFamily: 'serif', marginTop: '20px'
        }}>
          Tap and zoom in the map
        </p>
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}