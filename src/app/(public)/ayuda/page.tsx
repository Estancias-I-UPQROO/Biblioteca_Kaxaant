"use client";

import { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Cargar componentes dinámicamente con SSR deshabilitado
const Plyr = dynamic(() => import('plyr-react'), {
  ssr: false,
  loading: () => <p>Cargando reproductor...</p>
});

const PDFViewer = dynamic(
  () => import('@react-pdf-viewer/core').then((mod) => mod.Viewer),
  { ssr: false }
);

const PDFWorker = dynamic(
  () => import('@react-pdf-viewer/core').then((mod) => mod.Worker),
  { ssr: false }
);

import 'plyr-react/plyr.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './AyudaPage.css';

export default function AyudaPage() {
  const [activePdf, setActivePdf] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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

  if (!isClient) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="ayuda-container">
      <div className="video-section">
        <h1 className="video-title">¿Cómo acceder a la biblioteca?</h1>
        <div className="plyr-container">
          <Plyr
            source={{
              type: 'video',
              sources: [{
                src: '/Como_acceder.mp4',
                type: 'video/mp4',
              }],
            }}
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
          <PDFWorker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: isMobile ? '60vh' : '80vh' }}>
              <PDFViewer fileUrl={pdfs[activePdf].file} />
            </div>
          </PDFWorker>
        </div>
      </div>
    </main>
  );
}