// RUTA: src/app/catalogo/page.tsx

// 1. ¡CRUCIAL! Esto le dice a Next.js que es un Componente de Cliente.
"use client";

import { useState, useEffect } from 'react';
// 2. Importa el archivo CSS (que crearás en el mismo directorio).
import './Catalogo.css';

// 3. Cambiamos la declaración para que sea la exportación por defecto de la página.
export default function CatalogoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // El resto de tu lógica se mantiene exactamente igual, ¡ya es perfecta!
  useEffect(() => {
    // El iframe puede tardar más o menos, pero mostramos el spinner
    // al menos 1.5 segundos para que no haya un parpadeo si carga muy rápido.
    const timer = setTimeout(() => {
      // Solo deja de cargar si el iframe no ha terminado por su cuenta.
      // Si el iframe ya cargó, setIsLoading(false) ya se habrá llamado.
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  return (
    // Usamos <main> para el contenido principal de la página, es una buena práctica.
    <main className="catalogo-container">
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      )}

      {loadError ? (
        <div className="error-container">
          <h2>No se pudo cargar el catálogo</h2>
          <p>Ocurrió un error al intentar incrustar el catálogo. Puedes acceder directamente desde el siguiente enlace:</p>
          <a
            href="https://siabuc.ucol.mx/upqroo"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            Acceder al catálogo externamente
          </a>
        </div>
      ) : (
        <iframe
          src="https://siabuc.ucol.mx/upqroo"
          title="Catálogo de la Biblioteca"
          className="catalogo-iframe"
          // Cuando el iframe termina de cargar, oculta el spinner
          onLoad={() => setIsLoading(false)}
          onError={handleIframeError}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }} // Oculta el iframe mientras carga para evitar un salto visual
        />
      )}
    </main>
  );
}