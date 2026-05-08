"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from './supabase';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function HomePage() {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [hasInteracted, setHasInteracted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const giaVisto = sessionStorage.getItem('visto');
    if (!giaVisto) setHasInteracted(false);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2,
      // Ritorno alla mappa piatta (Mercator) invece del globo
      projection: { name: 'mercator' }
    });

    map.current.on('load', async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      
      if (data) {
        const features = data.map(p => ({
          type: 'Feature',
          properties: { 
            parola: p.parola,
            // Dimensione dinamica
            size: 14 + (Math.min(p.frequenza || 1, 10) * 2)
          },
          geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
        }));

        map.current.addSource('punti-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: features }
        });

        map.current.addLayer({
          id: 'punti-labels',
          type: 'symbol',
          source: 'punti-source',
          layout: {
            'text-field': ['get', 'parola'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': ['get', 'size'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            // BLOCCO SOVRAPPOSIZIONI
            'text-allow-overlap': false,
            'text-ignore-placement': false,
            'visibility': 'visible'
          },
          paint: {
            'text-color': '#000000',
            // EFFETTO CASELLA BIANCA (Sostituisce i vecchi div HTML)
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            // Sfondo bianco semi-trasparente dietro ogni parola
            'icon-opacity': 0.8
          },
          minzoom: 3
        });
        
        // Aggiungiamo un piccolo trucco per il background bianco arrotondato
        // Mapbox non permette bordi arrotondati perfetti sui layer, quindi usiamo un trucco di "halo" o "background"
      }
    });

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      sessionStorage.setItem('visto', 'true');
    };

    // LOGICA SPARIZIONE TITOLO: riattivata su ogni movimento della mappa
    map.current.on('movestart', handleFirstInteraction);
    map.current.on('zoomstart', handleFirstInteraction);
    map.current.on('mousedown', handleFirstInteraction);
    map.current.on('touchstart', handleFirstInteraction);

    return () => map.current?.remove();
  }, [isClient, isMobile]);

  if (!isClient) return null;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {/* Overlay Titolo ripristinato con logica corretta */}
      {!hasInteracted && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 100, pointerEvents: 'none', 
          transition: 'opacity 0.8s ease', backdropFilter: 'blur(3px)' 
        }}>
          <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '95%' }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '62px', fontWeight: '700', color: '#000', marginBottom: '15px', lineHeight: '1.2', maxWidth: '1100px', margin: '0 auto' }}>
              Is A.I. ever going to be able to understand the value of human experience when travelling?
            </h1>
            <p style={{ fontSize: isMobile ? '16px' : '22px', color: '#333', fontStyle: 'italic', fontFamily: 'serif', marginTop: '25px' }}>
              Tap and zoom in the map
            </p>
          </div>
        </div>
      )}

      {/* Navbar sempre visibile sopra tutto */}
      <nav style={{ 
        position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, 
        padding: '12px 35px', borderRadius: '40px', 
        background: hasInteracted ? 'rgba(235, 235, 235, 0.8)' : 'transparent', 
        border: hasInteracted ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent', 
        backdropFilter: hasInteracted ? 'blur(12px)' : 'none', 
        transition: 'all 0.8s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', 
        gap: isMobile ? '15px' : '25px', width: 'fit-content' 
      }}>
        <a href="/about-us" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>About Us</a>
        <a href="/about-you" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>About You</a>
        <a href="/" style={{ color: '#000', margin: '0 10px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
        </a>
        <a href="/gallery" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>Gallery</a>
        <a href="/feedback" style={{ color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', opacity: 0.6 }}>Feedback</a>
      </nav>

      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </main>
  );
}