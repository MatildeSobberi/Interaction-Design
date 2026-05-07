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

  const ZOOM_THRESHOLD = 4; 

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
      zoom: 2,
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

    map.current.on('zoom', () => {
      setCurrentZoom(map.current.getZoom());
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach(m => m.remove());

    if (currentZoom < ZOOM_THRESHOLD) return;

    punti.forEach((punto) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerText = punto.parola;
      el.style.fontFamily = 'var(--font-roboto), sans-serif';
      el.style.background = 'rgba(255, 255, 255, 0.6)';
      el.style.padding = '8px 15px';
      el.style.borderRadius = '20px';
      el.style.border = '1px solid rgba(255, 255, 255, 0.4)';
      el.style.color = '#000';
      el.style.fontSize = `${14 + (punto.frequenza * 3)}px`;
      el.style.fontWeight = 'bold';
      el.style.backdropFilter = 'blur(4px)';
      
      new mapboxgl.Marker(el)
        .setLngLat([punto.lng, punto.lat])
        .addTo(map.current);
    });
  }, [punti, currentZoom]);

  const linkStyle = { 
    color: '#000', 
    textDecoration: 'none', 
    fontFamily: 'var(--font-roboto), sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
    zIndex: 12
  };

  const navItems = [
    { label: 'About Us', href: '/about-us' },
    { label: 'About You', href: '/about-you' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Feedback', href: '/feedback' }
  ];

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {/* OVERLAY DI SFONDO OPACO */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', 
        zIndex: 4,
        pointerEvents: 'none',
        transition: 'opacity 1s ease',
        opacity: hasInteracted ? 0 : 1,
        visibility: hasInteracted ? 'hidden' : 'visible',
        backdropFilter: 'blur(2px)'
      }} />

      {/* NAVBAR CON UNICO RIQUADRO GRIGIO LUNGO */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '30px',
        right: '30px',
        zIndex: 10,
        padding: '12px 40px',
        borderRadius: '40px',
        background: hasInteracted ? 'rgba(230, 230, 230, 0.7)' : 'transparent',
        border: hasInteracted ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent',
        backdropFilter: hasInteracted ? 'blur(12px)' : 'none',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {navItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <a href={item.href} style={linkStyle}>{item.label}</a>
            
            {index < navItems.length - 1 && (
              <div style={{
                flexGrow: 1,
                height: '1px',
                background: '#000',
                margin: '0 25px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.2
              }}>
                <div style={{
                  width: '5px', 
                  height: '5px', 
                  background: '#000', 
                  borderRadius: '50%',
                  position: 'absolute'
                }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* MESSAGGIO CENTRALE - TESTO CORRETTO */}
      <div style={{
        position: 'absolute', 
        top: '55%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: 5, 
        textAlign: 'center', 
        width: '95%', 
        maxWidth: '1200px',
        transition: 'all 0.8s ease',
        opacity: hasInteracted ? 0 : 1,
        visibility: hasInteracted ? 'hidden' : 'visible',
        pointerEvents: 'none'
      }}>
        <h1 style={{ 
          fontSize: '60px', 
          fontWeight: '700', 
          color: '#000', 
          marginBottom: '25px', 
          lineHeight: '1.05',
          letterSpacing: '-1.5px'
        }}>
          What if A.I. started with a question,<br /> 
          being curious about the world?<br /> 
          But it could never <span style={{ fontStyle: 'italic' }}>trully</span> learn?
        </h1>

        <p style={{ 
          fontSize: '24px', 
          color: '#333', 
          fontStyle: 'italic',
          fontFamily: 'serif',
          marginTop: '40px',
          opacity: 0.8
        }}>
          Tap and zoom in the map
        </p>
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

    </main>
  );
}