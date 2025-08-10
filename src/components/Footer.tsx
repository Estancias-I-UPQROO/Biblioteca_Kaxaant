// RUTA: src/components/Footer.tsx

// 1. Lo convertimos en Componente de Cliente para usar 'window'
"use client";

// 2. Importamos Link de Next.js
import Link from "next/link";
import Image from "next/image"; // Usamos Image de Next.js para el logo
import { PageContainer } from "./PageContainer"; // Asegúrate de que esta ruta sea correcta
import './Footer.css'; // Asegúrate de tener este archivo CSS

const handleSmoothScroll = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Footer = () => {
  return (
    <footer className="footer-bg">
      <div className="footer-orange-bg">
        <PageContainer>
          <div className="grid gap-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-white">
              {/* Usamos el componente Image optimizado de Next.js */}
              <Image src="/Upqroo_Logo.png" alt="Upqroo Logo" width={200} height={50} />
              <p className="text-center my-5">Síguenos en nuestras redes sociales</p>
            </div>

            <div className="text-white">
              <h3 className="font-extrabold uppercase mb-5">Enlaces Útiles</h3>
              <ul className="mt-5 space-y-5 flex flex-col">
                <li>
                  {/* 3. Cambiamos 'to' por 'href' */}
                  <Link href='/renovacion' onClick={handleSmoothScroll}>
                    Renovación
                  </Link>
                </li>
                <li>
                  {/* 3. Cambiamos 'to' por 'href' */}
                  <Link href='/ayuda' onClick={handleSmoothScroll}>
                    Ayuda
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-white font-bold space-y-5">
              <h3 className="font-extrabold uppercase mb-5">Horario de atención</h3>
              <ul className="font-normal">
                <p>Lunes - Viernes:</p>
                <li>09:00 a.m. - 14:00 p.m.</li>
                <li>17:00 p.m. - 20:00 p.m.</li>
              </ul>
              <ul className="font-normal">
                <p>Sábado - Domingo:</p>
                <li>Cerrado</li>
              </ul>
            </div>

            <div className="text-white font-bold">
              <h3 className="font-extrabold uppercase mb-5">Contactanos</h3>
              <ul className="space-y-5 font-normal">
                <li>998 283 1859</li>
                <li>biblioteca@upqroo.edu.mx</li>
                <li>Smza. 255, Mza. 11, Lote 1119-33 77500 Cancún, México</li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
};