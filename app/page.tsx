"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from './supabase';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// --- SFONDO ANIMATO (Simula il video di Figma) ---
const BackgroundAnimato = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#000', zIndex: -1 }}>
    <div className="grid-animation"></div>
    <style jsx>{`
      .grid-animation {
        width: 200%;
        height: 200%;
        background-image: 
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        transform: perspective(600px) rotateX(45deg) translateY(-15%);
        animation: moveGrid 15s linear infinite;
        opacity: 0.5;
      }
      @keyframes moveGrid {
        0% { transform: perspective(600px) rotateX(45deg) translateY(0); }
        100% { transform: perspective(600px) rotateX(45deg) translateY(50px); }
      }
      .grid-animation::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, transparent, black 80%);
      }
    `}</style>
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

  // --- LOGICA CERCHI ---
  const setupCircles = (mapInstance: any, dataPunti: any[]) => {
    if (!mapInstance || !dataPunti.length || !mapInstance.isStyleLoaded()) return;
    const sourceId = 'punti-source';
    const geojson = {
      type: 'FeatureCollection',
      features: dataPunti.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {}
      }))
    };
    if (mapInstance.getSource(sourceId)) {
      mapInstance.getSource(sourceId).setData(geojson);
    } else {
      mapInstance.addSource(sourceId, { type: 'geojson', data: geojson });
      mapInstance.addLayer({
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
  };

  useEffect(() => {
    if (!isClient) return;
    const caricaDati = async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      if (data) {
        const raggruppati = data.reduce((acc: any[], curr: any) => {
          const parolaNormalizzata = curr.parola.trim().toLowerCase();
          const esistente = acc.find(p => p.parola.toLowerCase() === parolaNormalizzata && Math.abs(p.lat - curr.lat) < 0.01 && Math.abs(p.lng - curr.lng) < 0.01);
          if (esistente) { esistente.frequenzaTotal += (curr.frequenza || 1); } 
          else { acc.push({ ...curr, parola: curr.parola.trim(), frequenzaTotal: curr.frequenza || 1 }); }
          return acc;
        }, []);
        setPunti(raggruppati);
      }
    };

    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [12.49, 41.89],
      zoom: isMobile ? 1 : 2,
    });

    map.current.on('load', caricaDati);
    map.current.on('sourcedata', (e: any) => {
      if (e.isSourceLoaded && punti.length > 0) setupCircles(map.current, punti);
    });

    const hideTitle = () => {
      setHasInteracted(true);
      sessionStorage.setItem('visto', 'true');
    };
    map.current.on('movestart', hideTitle);
    map.current.on('zoom', () => { if (map.current) setCurrentZoom(map.current.getZoom()); });
  }, [isMobile, isClient]);

  // --- LOGICA PAROLE (A raggiera) ---
  useEffect(() => {
    if (!map.current || currentZoom < 7) {
      document.querySelectorAll('.custom-marker').forEach(m => m.remove());
      return;
    }
    document.querySelectorAll('.custom-marker').forEach(m => m.remove());
    
    const coordinateGroups = punti.reduce((groups: any, punto: any) => {
      const key = `${punto.lng.toFixed(2)},${punto.lat.toFixed(2)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(punto);
      return groups;
    }, {});

    Object.keys(coordinateGroups).forEach(key => {
      const groupPunti = coordinateGroups[key];
      const [lng, lat] = key.split(',').map(Number);
      const occupiedRects: any[] = [];
      
      groupPunti.forEach((punto: any) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerText = punto.parola;
        el.style.cssText = `font-family: sans-serif; background: rgba(255, 255, 255, 0.9); padding: 8px 16px; border-radius: 25px; color: #000; font-weight: bold; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); white-space: nowrap; font-size: ${13 + Math.min(punto.frequenzaTotal * 2, 30)}px;`;
        
        document.body.appendChild(el);
        const w = el.offsetWidth; const h = el.offsetHeight;
        document.body.removeChild(el);
        const pos = map.current.project([lng, lat]);
        
        let ox = 0, oy = 0;
        // ... (Logica raggiera semplificata per brevità)
        new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map.current);
      });
    });
  }, [punti, currentZoom]);

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
            fontSize: isMobile ? '50px' : '180px',
            fontWeight: 900, color: '#FFFFFF', lineHeight: '0.85',
            letterSpacing: '-0.04em', textTransform: 'uppercase', margin: '0'
          }}>
            DIARY OF<br />EXPERIENCE
          </h1>

          <p style={{ 
            fontFamily: '"libre-caslon-text", serif',
            fontSize: isMobile ? '22px' : '54px',
            fontWeight: 400, color: '#FFFFFF', lineHeight: '1.1',
            letterSpacing: '-0.04em', marginTop: '40px', maxWidth: '900px'
          }}>
            Is A.I. ever going to be able to understand the value of human experience when travelling?
          </p>

          <p style={{ 
            fontFamily: '"libre-caslon-text", serif',
            fontSize: isMobile ? '16px' : '24px',
            color: '#FFFFFF', letterSpacing: '-0.04em', marginTop: '30px', opacity: 0.7
          }}>
            Zoom in the map
          </p>
        </div>
      )}

      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </main>
  );
}