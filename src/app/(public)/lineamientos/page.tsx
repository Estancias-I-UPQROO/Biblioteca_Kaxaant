// RUTA: src/app/lineamientos/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { FaRegHandshake, FaFilePdf } from "react-icons/fa";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import "./LineamientosPage.css"; // Asegúrate de que este archivo exista

// Cambiamos a la exportación por defecto para que funcione como una página de Next.js
export default function LineamientosPage() {
  const [isMobile, setIsMobile] = useState(false);
  const pdfUrl = "/Lineamientos_para_el_funcionamiento_de_la_biblioteca_de_la_Universidad_Politecnica_de_Quintana_roo.pdf";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dejamos tu JSX original tal cual para que no se acorte el espacio
  return (
    <>
      <div className="intro-section">
        <div className="intro-split better-layout">
          <div className="intro-text centered-text">
            <div>
              <p>
                Los lineamientos de la biblioteca son el conjunto de normas, políticas y procedimientos que rigen el funcionamiento y uso de los espacios, recursos y servicios de la institución.
              </p>
              <p>
                Es importante que todos los usuarios conozcan y respeten estos lineamientos, ya que contribuyen a crear un ambiente de aprendizaje productivo y agradable para toda la comunidad.
              </p>
              <div className="call-to-action">
                <FaRegHandshake className="cta-icon" />
                <span>¡Le invitamos a familiarizarse con estos lineamientos para sacar el máximo provecho de los recursos y servicios que ofrece nuestra biblioteca!</span>
              </div>
            </div>
          </div>

          <div className="intro-pdf">
            <div className="pdf-container">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div style={{ height: isMobile ? '60vh' : '80vh', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <Viewer fileUrl={pdfUrl} />
                </div>
              </Worker>
              <a href={pdfUrl} download className="download-button primary">
                <FaFilePdf /> Descargar PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};