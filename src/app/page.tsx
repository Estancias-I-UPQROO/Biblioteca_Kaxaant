// RUTA: app/page.tsx (Este es tu nuevo componente de Servidor)
import InicioClient from '@/components/InicioClient'; // Asumiendo que crearás la carpeta 'components'
import type { Hero, Evento } from '@/lib/types'; // (Opcional) Mover tipos a un archivo separado

// --- Funciones para obtener datos en el SERVIDOR ---

async function getImagenesHero(): Promise<Hero[]> {
  const BASE_URL_S = process.env.VITE_API_URL_Silder;
  try {
    const res = await fetch(`http://localhost:4501/api/slider-hero/get-sliders`, {
      cache: 'no-store', // Opcional: Evita que Next.js cachee esta petición
    });
    if (!res.ok) throw new Error('Error cargando imágenes del hero');
    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Devuelve un array vacío en caso de error
  }
}

async function getEventos(): Promise<Evento[]> {
  const BASE_URL_E = process.env.VITE_API_URL_Eventos;
  try {
    const res = await fetch(`http://localhost:4501/api/eventos/get-eventos`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error cargando eventos');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- El componente de página en sí ---

export default async function InicioPage() {
  // 1. Obtenemos los datos en paralelo en el servidor antes de renderizar
  const [imagenesHero, inicioEventos] = await Promise.all([
    getImagenesHero(),
    getEventos(),
  ]);

  // 2. Pasamos los datos como props al componente cliente
  return (
    <InicioClient
      imagenesHero={imagenesHero}
      inicioEventos={inicioEventos}
    />
  );
}