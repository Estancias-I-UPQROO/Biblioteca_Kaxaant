// RUTA: src/components/RedesSociales.tsx

// ¡CRUCIAL! Se convierte en un Componente de Cliente para usar hooks y 'window'.
"use client";

import React, { useState, useEffect } from 'react';
import './RedesSociales.css'; // Recuerda crear este archivo CSS en la misma carpeta

// --- Tipos (sin cambios) ---
interface RedSocial {
  id: string;
  nombre: string;
  link: string;
  icono: string;
}

interface RedesSocialesProps {
  redes: RedSocial[];
}

// --- Componente (casi sin cambios) ---
export const RedesSociales: React.FC<RedesSocialesProps> = ({ redes }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = () => setExpanded(prev => !prev);
  
  // Tu JSX y la función getSocialClass se mantienen exactamente igual.
  // No hay necesidad de cambiarlos.

  return (
    <div className={`redes-sociales ${isMobile ? 'mobile' : ''}`}>
      {isMobile ? (
        <>
          <div className={`social-collapse ${expanded ? 'expanded' : ''}`}>
            {redes.map((red) => (
              <a
                key={red.id}
                href={red.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`red-social ${getSocialClass(red.icono)}`}
                aria-label={red.nombre}
              >
                <i className={`fab ${red.icono}`}></i>
              </a>
            ))}
          </div>
          
          <button
            className="red-social toggle-button"
            onClick={toggleExpanded}
            aria-label={expanded ? "Ocultar redes sociales" : "Mostrar redes sociales"}
          >
            <i className={`fas ${expanded ? 'fa-share' : 'fa-share-alt'}`}></i>
          </button>
        </>
      ) : (
        redes.map((red) => (
          <a
            key={red.id}
            href={red.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`red-social ${getSocialClass(red.icono)}`}
            aria-label={red.nombre}
          >
            <i className={`fab ${red.icono}`}></i>
          </a>
        ))
      )}
    </div>
  );
};

const getSocialClass = (icono: string) => {
  if (icono.includes('facebook')) return 'facebook';
  if (icono.includes('x')) return 'x';
  if (icono.includes('instagram')) return 'instagram';
  if (icono.includes('youtube')) return 'youtube';
  if (icono.includes('tiktok')) return 'tiktok';
  return '';
};