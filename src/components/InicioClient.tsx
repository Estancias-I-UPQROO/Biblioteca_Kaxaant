// RUTA: components/InicioClient.tsx (Este es tu nuevo componente de Cliente)
"use client"; // ¡MUY IMPORTANTE!

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // CAMBIO: de react-router-dom a next/navigation
import Link from 'next/link'; // Opcional pero recomendado para navegación interna
import Image from 'next/image'; // Opcional pero recomendado para optimización
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './InicioClient.css'; // Asegúrate que este archivo existe en la misma carpeta

// Asumiendo que moviste los tipos a un archivo central
import type { Hero, Evento } from '@/lib/types';

// Propiedades que el componente recibe del servidor
interface InicioClientProps {
  imagenesHero: Hero[];
  inicioEventos: Evento[];
}

export default function InicioClient({ imagenesHero, inicioEventos }: InicioClientProps) {
  const router = useRouter(); // CAMBIO: Hook de navegación de Next.js

  // ELIMINADO: Los useEffect que hacían fetch de `imagenesHero` e `inicioEventos` ya no son necesarios.

  // MANTENIDO: El useEffect para el scroll sigue siendo válido.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // MANTENIDO: Toda la lógica de estado para el modal y los sliders
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [imagenActual, setImagenActual] = useState<string | null>(null);

  const settingsHero: Settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: false
  };

  const totalItems = 3 + inicioEventos.length;
  const slidesToShowValue = Math.min(3, totalItems);

  const settingsJustinMind: Settings = {
    // ... sin cambios en la configuración ...
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShowValue,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: 'ondemand',
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, totalItems) }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  // MANTENIDO: Las funciones del modal no cambian
  const abrirModal = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setImagenActual(evento.Imagen_URL);
    setModalAbierto(true);
  };
  // ... resto de funciones del modal (cerrarModal, cambiarImagen) ...
  const cerrarModal = () => {
    setModalAbierto(false);
    setEventoSeleccionado(null);
    setImagenActual(null);
  };

  const cambiarImagen = (nuevaImagen: string) => {
    setImagenActual(nuevaImagen);
  };


  return (
    <div className="inicio-container">
      {/* Hero Banner */}
      <section className="hero-biblioteca">
        <div className="contenido-hero">
          <h1>BIBLIOTECA VIRTUAL KAXÁANT</h1>
          <h2>UNIVERSIDAD POLITÉCNICA DE QUINTANA ROO</h2>
        </div>
        <Slider {...settingsHero} className="hero-slider">
          {imagenesHero.map((src, idx) => (
            <div key={idx} className="slide-biblio">
              <img
                // CAMBIO: Acceso a variables de entorno y a la URL de la imagen
                src={`http://localhost:4501${src.Imagen_URL}`}
                alt={`Imagen biblioteca ${idx}`}
              />
              <div className="slide-overlay"></div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Carrusel de Eventos */}
      <section className="slider-jmind">
        <Slider {...settingsJustinMind} className="slider-container">
        
          {/* CAMBIO: Se usa el componente Link de Next para rutas internas */}
          <Link href="/ayuda" className="slider-card">
            {/* CAMBIO: Ruta de imagen estática */}
            <img src={'/Como_acceder.png'} alt="Cómo usar la Biblioteca" />
            <div className="slider-hover-box">
              <h3>¿Cómo usar la Biblioteca?</h3>
              <p>Haz clic para ir a la página de ayuda.</p>
            </div>
          </Link>

          {/* CAMBIO: Se usa el componente Link de Next para rutas internas */}
          <Link href="/recursos-electronicos/e30f1e48-c61e-4635-a1f3-ab66cd108500" className="slider-card">
              <img src={'/novedades.jpeg'} alt="Novedades" />
              <div className="slider-hover-box">
                  <h3>Novedades</h3>
                  <p>Haz clic para explorar las novedades.</p>
              </div>
          </Link>

          <div
            className="slider-card"
            // SIN CAMBIOS: window.open sigue funcionando igual
            onClick={() => window.open('https://login.vitalsource.com/?context=bookshelf&redirect_uri=https%3A%2F%2Fupqroo.vitalsource.com%2Fhome%2Fexplore%3Fcontext_token%3Df3022c70-5522-013e-16a2-560b2d3411be%26request_token%3DeyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..Q0QR74wMd2NE6snlQTcwpA.RmPe5z3vW7NYZTomO2EOv6X-INzNQpvTF460KLnYPSWK7ei4Ay-7pr2cSBqFfS71gQFhJiaChbfZMYU8D6awLhnjaFfgctYijChonbd50QkQF5SWQy6iISXrwTEX1NBR1bXlXzzT1cKaGwSMC_1H6cB2263s1NMx-3FIU0HW8_Y.2uTtGUchyL_8d7yE-cCtPg&brand=upqroo.vitalsource.com&method=universal&auth_host=upqroo.vitalsource.com&auth_protocol=https%3A', '_blank')}
          >
            <img src={'/Pearson.jpeg'} alt="Pearson" />
            <div className="slider-hover-box">
                <h3>Pearson</h3>
                <p>Haz clic para explorar Pearson.</p>
            </div>
          </div>

          {/* Cards dinámicas que vienen del backend (ahora desde props) */}
          {inicioEventos.map((evento) => (
            <div
              key={evento.ID_Evento}
              className="slider-card"
              onClick={() => abrirModal(evento)}
            >
              <img
                // CAMBIO: Acceso a variables de entorno
                src={`http://localhost:4501${evento.Imagen_URL}`}
                alt={evento.Titulo}
              />
              <div className="slider-hover-box">
                <h3>{evento.Titulo}</h3>
                <p>Haz clic para más información</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Modal (sin cambios en su lógica o JSX) */}
      {modalAbierto && eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>
            <div className="modal-imagen-container">
              <img
                src={imagenActual?.startsWith('http') ? imagenActual : `http://localhost:4501/${imagenActual || eventoSeleccionado.Imagen_URL}`}
                alt={eventoSeleccionado.Titulo}
                className="modal-imagen-fullscreen"
              />
            </div>
            <div className="modal-texto">
              <h3>{eventoSeleccionado.Titulo}</h3>
              <p>{eventoSeleccionado.Descripcion}</p>
              {eventoSeleccionado.SubEventos && eventoSeleccionado.SubEventos.length > 0 && (
                <div className="botones-imagenes">
                  {eventoSeleccionado.SubEventos.map((subevento) => (
                    <button
                      key={subevento.ID_SubEvento}
                      className={`imagen-boton ${imagenActual === subevento.Imagen_URL ? 'activo' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        cambiarImagen(`http://localhost:4501/${subevento.Imagen_URL}`)
                      }}
                    >
                      {subevento.Titulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}