"use client";

import { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

// Importaciones de las librerías y sus estilos
import { Viewer, Worker } from '@react-pdf-viewer/core';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Importa tus estilos locales
import './AyudaPage.css';

// 2. Renombramos el componente y lo exportamos por defecto.
export default function AyudaPage() {
  const [activePdf, setActivePdf] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // El resto de tu código de lógica y JSX es prácticamente idéntico.
  // Ya está bien escrito para un entorno de cliente.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pdfs = [
    {
      title: "Guía de uso de Digitalia Hispánica",
      file: "/guia_de_uso_digitalia_hispanica.pdf",
      downloadName: "guia-uso-digitalia.pdf"
    },
    {
      title: "Guía de Acceso a Pearson Higher Education",
      file: "/Guia_acceso_PHE.pdf",
      downloadName: "guia-acceso-pearson.pdf"
    }
  ];

  return (
    <main className="ayuda-container">
      <div className="video-section">
        <h1 className="video-title">¿Cómo acceder a la biblioteca?</h1>
        <div className="plyr-container">
          <Plyr
            source={{
              type: 'video',
              sources: [
                {
                  src: '/Como_acceder.mp4',
                  type: 'video/mp4',
                },
              ],
            }}
            // ... opciones de Plyr ...
          />
        </div>
      </div>

      <div className="pdf-viewer-container">
        <div className="pdf-header">
          <h2>{pdfs[activePdf].title}</h2>
          <a
            href={pdfs[activePdf].file}
            download={pdfs[activePdf].downloadName}
            className="download-btn"
          >
            <FaDownload /> <span className="btn-text">Descargar</span>
          </a>
        </div>

        <div className="pdf-thumbnails">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className={`thumbnail ${index === activePdf ? 'active' : ''}`}
              onClick={() => setActivePdf(index)}
            >
              <FaFilePdf className="pdf-icon" />
              <span>{pdf.title}</span>
            </div>
          ))}
        </div>

        <div className="pdf-viewer">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: isMobile ? '60vh' : '80vh' }}>
              <Viewer fileUrl={pdfs[activePdf].file} />
            </div>
          </Worker>
        </div>
      </div>
    </main>
  );
};