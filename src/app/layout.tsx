// RUTA: src/app/layout.tsx (VERSIÓN LIMPIA)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Solo los estilos globales se quedan aquí

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca Virtual UPQROO", // Título general
  description: "Universidad Politécnica de Quintana Roo",
  icons: {
    icon: '/icono.png', // Path to your icon inside the 'public' folder
  },
};

// Este es el layout raíz que envuelve TODO, público y admin.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}