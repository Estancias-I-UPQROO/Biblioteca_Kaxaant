// RUTA: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar"; // Asumiendo la ruta a tu Navbar
import "./globals.css";

// 1. Define el tipo para tus categorías (puedes moverlo a lib/types.ts)
type Categoria = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
};

// 2. Crea una función asíncrona para obtener los datos en el servidor
async function getCategories(): Promise<Categoria[]> {
  const BASE_URL_C = process.env.VITE_API_URL_Categorias_Recursos_Electronicos;
  try {
    // Usamos fetch, que está optimizado en Next.js
    const res = await fetch(`http://localhost:4501/api/categorias-recursos-electronicos/get-categorias`, {
      next: { revalidate: 3600 } // Opcional: Cachea por 1 hora
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biblioteca Virtual",
  description: "Universidad Politécnica de Quintana Roo",
};

// 3. Convierte tu RootLayout en una función 'async'
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 4. Llama a la función para obtener los datos
  const categorias = await getCategories();

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 5. Pasa las categorías como prop al Navbar */}
        <Navbar categorias={categorias} />
        <main>{children}</main>
      </body>
    </html>
  );
}