"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from './supabase';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// --- SFONDO ANIMATO "TIPO FIGMA" (Trattini e distorsione) ---
const BackgroundAnimato = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#000', zIndex: -1 }}>
    {/* Griglia di trattini */}
    <div className="dashes-grid" style={{
      width: '200%',
      height: '200%',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)',
      backgroundSize: '40px 30px',
      backgroundRepeat: 'repeat',
    }} />
    
    {/* Overlay per l'effetto vignetta (buio ai bordi) */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at center, transparent 0%, black 85%)'
    }} />

    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes figmaMorph {
        0% { transform: perspective(1000px) rotateX(25deg) rotateY(0deg) scale(1); opacity: 0.3; }
        50% { transform: perspective(1000px) rotateX(30deg) rotateY(2deg) scale(1.05); opacity: 0.6; }
        100% { transform: perspective(1000px) rotateX(25deg) rotateY(0deg) scale(1); opacity: 0.3; }
      }
      .dashes-grid {
        animation: figmaMorph 12s ease-in-out infinite !important;
        mask-image: linear-gradient(to right, white 12px, transparent 12px);
        -webkit-mask-image: linear-gradient(to right, white 12px, transparent 12px);
        will-change: transform;
      }
    `}} />
  </div>
);

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
    if (!giaVisto) setHasInteracted(false);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Logica Mappa e Caricamento Dati
  useEffect(() => {
    if (!isClient) return;
    
    const caricaDati = async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      if (data) {
        const raggruppati = data.reduce((acc: any[], curr: any) => {
          const parolaNormalizzata = curr.parola.trim().toLowerCase();
          const esistente = acc.find(p => 
            p.parola.toLowerCase() === parolaNormalizzata &&
            Math.abs(p.lat - curr.lat) < 0.01 && Math.abs(p.lng - curr.lng) < 0.01
          );
          if (esistente) { esistente.frequenzaTotal += (curr.frequenza || 1); } 
          else { acc.push({ ...curr, parola: curr.parola.trim(), frequenzaTotal: curr.frequenza || 1 }); }
          return acc;
        }, []);
        setPunti(raggruppati);
      }
    };

    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2,
    });

    map.current.on('load', caricaDati);
    map.current.on('movestart', () => {
      setHasInteracted(true);
      sessionStorage.setItem('visto', 'true');
    });
    map.current.on('zoom', () => setCurrentZoom(map.current.getZoom()));
  }, [isMobile, isClient]);

  // Gestione Punti e Marker Parole
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const sourceId = 'punti-source';
    const geojson = {
      type: 'FeatureCollection',
      features: punti.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {}
      }))
    };

    if (map.current.getSource(sourceId)) {
      map.current.getSource(sourceId).setData(geojson);
    } else {
      map.current.addSource(sourceId, { type: 'geojson', data: geojson });
      map.current.addLayer({
        id: 'punti-circles',
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': isMobile ? 6 : 8,
          'circle-color': '#000000',
          'circle-opacity': 0.5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        },
        maxzoom: 7 
      });
    }

    document.querySelectorAll('.custom-marker').forEach(m => m.remove());
    if (currentZoom >= 7) {
      punti.forEach((punto: any) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerText = punto.parola;
        el.style.cssText = `
          font-family: "trade-gothic-next", sans-serif;
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 16px;
          border-radius: 25px;
          color: #000;
          font-weight: 900;
          backdrop-filter: blur(5px);
          font-size: ${14 + Math.min(punto.frequenzaTotal * 2, 30)}px;
          white-space: nowrap;
        `;
        new mapboxgl.Marker(el).setLngLat([punto.lng, punto.lat]).addTo(map.current);
      });
    }
  }, [punti, currentZoom, isMobile]);

  if (!isClient) return null;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {!hasInteracted && (
        <div style={{ 
          position: 'absolute', inset: 0, zIndex: 100, 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', 
          paddingLeft: isMobile ? '20px' : '80px', pointerEvents: 'none',
          transition: 'opacity 1s ease-in-out'
        }}>
          
          <BackgroundAnimato />

          <h1 style={{ 
            fontFamily: '"trade-gothic-next", sans-serif',
            fontSize: isMobile ? '60px' : '180px',
            fontWeight: 900, color: '#FFFFFF', lineHeight: '0.85',
            letterSpacing: '-0.04em', textTransform: 'uppercase', margin: '0'
          }}>
            DIARY OF<br />EXPERIENCE
          </h1>

          <p style={{ 
            fontFamily: '"libre-caslon-text", serif',
            fontSize: isMobile ? '24px' : '54px',
            fontWeight: 400, color: '#FFFFFF', lineHeight: '1.1',
            letterSpacing: '-0.04em', marginTop: '40px', maxWidth: isMobile ? '90%' : '1000px'
          }}>
            Is A.I. ever going to be able to understand the value of human experience when travelling?
          </p>

          <p style={{ 
            fontFamily: '"libre-caslon-text", serif',
            fontSize: isMobile ? '16px' : '24px',
            color: '#FFFFFF', letterSpacing: '-0.04em', marginTop: '30px', opacity: 0.8
          }}>
            Zoom in the map
          </p>
        </div>
      )}

      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </main>
  );
}