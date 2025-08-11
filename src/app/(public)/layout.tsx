// RUTA: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

// --- Estilos Globales ---
import '@fortawesome/fontawesome-free/css/all.css';
import "./globals.css";

// --- Importaciones de Componentes ---
// Asegúrate de que las importaciones con {} coincidan con las exportaciones 'export const'
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LibraryAssistant } from "@/components/LibraryAssistant";
import { RedesSociales } from '@/components/RedesSociales';

// --- Tipos y Datos ---
type Categoria = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
  Activo: boolean; 
};

const redesSocialesData = [
  { id: '1', nombre: 'Facebook', icono: 'fa-facebook', link: 'https://facebook.com/upqroo' },
  { id: '2', nombre: 'X', icono: 'fa-x-twitter', link: 'https://x.com/upqroo' },
  { id: '3', nombre: 'Instagram', icono: 'fa-instagram', link: 'https://www.instagram.com/up_qroo/' },
  { id: '4', nombre: 'YouTube', icono: 'fa-youtube', link: 'https://www.youtube.com/@prensaydifusionupqroo4898' },
  { id: '5', nombre: 'Tiktok', icono: 'fa-tiktok', link: 'https://www.tiktok.com/@upqroo' },
];

// --- Función para Obtener Datos ---
async function getCategories(): Promise<Categoria[]> {
  try {
    const res = await fetch(`http://academico.upqroo.edu.mx/api/categorias-recursos-electronicos/get-categorias`, {
      next: { revalidate: 2000 }
    });
    if (!res.ok) return [];
    const data: Categoria[] = await res.json();
    return data.filter(cat => cat.Activo);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca Kaxáant",
    description: "Universidad Politécnica de Quintana Roo",
  icons: {
    icon: '/icono.png', // Path to your icon inside the 'public' folder
  },
};

// --- Layout Principal ---
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categorias = await getCategories();

  return (
       <div className="site-container">
      <Navbar categorias={categorias} />
      <main className="main-content">
        {children}
      </main>
      
      <RedesSociales redes={redesSocialesData} />
      <LibraryAssistant initialCategories={categorias} />
      <Footer />
    </div>
  );

}