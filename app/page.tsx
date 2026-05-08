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
    if (!giaVisto) setHasInteracted(false);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const caricaDati = async () => {
      const { data } = await supabase.from('segnalazioni').select('*');
      if (data) {
        // --- LOGICA 1 & 2: Raggruppamento e Grandezza ---
        // Uniamo parole uguali nella stessa zona e sommiamo la frequenza
        const raggruppati = data.reduce((acc: any[], curr: any) => {
          const esistente = acc.find(p => 
            p.parola.toLowerCase() === curr.parola.toLowerCase() &&
            Math.abs(p.lat - curr.lat) < 0.01 && // Raggruppa se sono molto vicini
            Math.abs(p.lng - curr.lng) < 0.01
          );
          if (esistente) {
            esistente.frequenzaTotal = (esistente.frequenzaTotal || existente.frequenza || 1) + (curr.frequenza || 1);
          } else {
            acc.push({ ...curr, frequenzaTotal: curr.frequenza || 1 });
          }
          return acc;
        }, []);
        setPunti(raggruppati);
      }
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

    const hideTitle = () => setHasInteracted(true);
    map.current.on('movestart', hideTitle);
    map.current.on('zoom', () => setCurrentZoom(map.current.getZoom()));
  }, [isMobile, isClient]);

  useEffect(() => {
    if (!map.current) return;
    document.querySelectorAll('.custom-marker').forEach(m => m.remove());
    if (currentZoom < 4) return;

    // --- LOGICA 3: Raggruppamento Geografico per Raggiera ---
    // Raggruppiamo i punti unici per coordinate
    const coordinateGroups = punti.reduce((groups: any, punto: any) => {
      if (!punto.lat || !punto.lng) return groups;
      const key = `${punto.lng.toFixed(2)},${punto.lat.toFixed(2)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(punto);
      return groups;
    }, {});

    Object.keys(coordinateGroups).forEach(key => {
      const groupPunti = coordinateGroups[key];
      const [lng, lat] = key.split(',').map(Number);
      
      // Ordiniamo per frequenza totale per posizionare le più importanti
      groupPunti.sort((a: any, b: any) => b.frequenzaTotal - a.frequenzaTotal);

      groupPunti.forEach((punto: any, index: number) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerText = punto.parola;
        
        // --- LOGICA 4: Stile Originale con Rettangolo ---
        el.style.fontFamily = 'var(--font-roboto), sans-serif';
        el.style.background = 'rgba(255, 255, 255, 0.8)';
        el.style.padding = isMobile ? '6px 12px' : '10px 20px';
        el.style.borderRadius = '25px';
        el.style.color = '#000';
        el.style.fontWeight = 'bold';
        el.style.backdropFilter = 'blur(5px)';
        el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        el.style.whiteSpace = 'nowrap';
        el.style.position = 'absolute';

        // --- LOGICA 2: Grandezza basata su frequenza aggregata ---
        const baseSize = isMobile ? 12 : 16;
        // La grandezza cresce con il numero di citazioni totali (frequenzaTotal)
        const extraSize = Math.min(punto.frequenzaTotal * 2, 35); 
        el.style.fontSize = `${baseSize + extraSize}px`;

        // --- LOGICA 3: Posizionamento a Raggiera (come immagine 10) ---
        let offsetX = 0;
        let offsetY = 0;

        if (index > 0) { // Il primo marker del gruppo sta al centro
          // Numero di parole per ogni "cerchio" concentrico
          const itemsPerCircle = 6; 
          // Raggio del primo cerchio (distanza dal centro)
          const baseRadius = isMobile ? 50 : 80; 
          // Quanto si allontana ogni cerchio successivo
          const radiusIncrement = isMobile ? 30 : 45; 
          
          const circleIndex = Math.floor((index - 1) / itemsPerCircle);
          const indexInCircle = (index - 1) % itemsPerCircle;
          // Calcolo angolo trigonometrico
          const angle = (indexInCircle / itemsPerCircle) * 2 * Math.PI;
          const currentRadius = baseRadius + (circleIndex * radiusIncrement);

          // Conversione in offset pixel X e Y
          offsetX = currentRadius * Math.cos(angle);
          offsetY = currentRadius * Math.sin(angle);
        }

        new mapboxgl.Marker(el)
          .setLngLat([punto.lng, punto.lat])
          .setOffset([offsetX, offsetY]) // Applica la raggiera
          .addTo(map.current);
      });
    });

  }, [punti, currentZoom, isMobile]);

  if (!isClient) return <div style={{ backgroundColor: '#fff', width: '100vw', height: '100vh' }} />;

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
      
      {!hasInteracted && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 100, pointerEvents: 'none', transition: 'opacity 0.8s ease', backdropFilter: 'blur(3px)' }}>
          <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '95%' }}>
            <h1 style={{ fontSize: isMobile ? '28px' : '62px', fontWeight: '700', color: '#000', marginBottom: '15px', lineHeight: '1.2', maxWidth: '1100px', margin: '0 auto' }}>
              Is A.I. ever going to be able to understand the value of human experience when travelling?
            </h1>
            <p style={{ fontSize: isMobile ? '16px' : '22px', color: '#333', fontStyle: 'italic', fontFamily: 'serif', marginTop: '25px' }}>Tap and zoom in the map</p>
          </div>
        </div>
      )}

      <nav style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '12px 35px', borderRadius: '40px', background: hasInteracted ? 'rgba(230, 230, 230, 0.7)' : 'transparent', border: hasInteracted ? '1px solid rgba(0, 0, 0, 0.05)' : '1px solid transparent', backdropFilter: hasInteracted ? 'blur(12px)' : 'none', transition: 'all 0.8s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '15px' : '25px', width: 'fit-content' }}>
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