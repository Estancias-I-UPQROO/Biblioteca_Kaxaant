// RUTA: src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, type ChangeEvent, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Admindash.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import { useResourceForm } from '@/hooks/useResourceForm'; // Descomenta cuando implementes la pestaña de Recursos

// --- Configuración de Axios ---
const api = axios.create({
  baseURL: 'http://localhost:4501/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Tipos de Datos ---
type HeroImage = { id: number; url: string; name: string; };
type Evento = {
  id: string;
  imagen: string;
  imagenFile?: File;
  titulo: string;
  activo: boolean;
  descripcion: string;
  botones: {
    ID_SubEvento?: string;
    texto: string;
    imagenAsociada: string | File;
  }[];
};
// Añade aquí los tipos para Recurso y Categoria cuando los necesites

export default function AdminDashboardPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'inicio' | 'recursos'>('inicio');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Estados para Hero Slider ---
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  
  // --- Estados para Eventos ---
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [addingEvento, setAddingEvento] = useState<Partial<Evento> | null>(null);

  // --- LÓGICA PARA HERO SLIDER ---
  const fetchSliderImages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/slider-hero/get-sliders');
      const data = response.data.map((item: any) => ({
        id: item.ID_Slider_Hero,
        url: `http://localhost:4501${item.Imagen_URL}`,
        name: item.Imagen_URL.split('/').pop() || 'Imagen',
      }));
      setHeroImages(data);
    } catch (err) {
      console.error("Error al obtener imágenes del slider:", err);
      setError("No se pudieron cargar las imágenes del slider.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('imagen', file);
      setLoading(true);
      try {
        await api.post('/slider-hero/add-slider', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await fetchSliderImages();
      } catch (err) {
        console.error("Error al subir imagen del slider:", err);
        setError("Error al subir la imagen.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteHeroImage = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;
    setLoading(true);
    try {
      await api.delete(`/slider-hero/delete-slider/${id}`);
      await fetchSliderImages();
    } catch (err) {
      console.error("Error al eliminar la imagen:", err);
      setError("Error al eliminar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA PARA EVENTOS ---
  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/eventos/get-eventos');
      const data = response.data.map((e: any) => ({
        id: e.ID_Evento,
        imagen: `http://localhost:4501${e.Imagen_URL}`,
        titulo: e.Titulo,
        activo: e.Activo,
        descripcion: e.Descripcion,
        botones: (e.SubEventos || []).map((se: any) => ({
          ID_SubEvento: se.ID_SubEvento,
          texto: se.Titulo,
          imagenAsociada: `http://localhost:4501${se.Imagen_URL}`
        }))
      }));
      setEventos(data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEventoForEditing = (evento: Evento) => {
    setAddingEvento(null);
    setEditingEvento({ ...evento, botones: evento.botones ? [...evento.botones] : [] });
  };

  const handleShowAddEventoForm = () => {
    setEditingEvento(null);
    setAddingEvento({ titulo: '', descripcion: '', imagen: '', botones: [] });
  };

  const handleEventoFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
    updateFunc((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEventoImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
      updateFunc((prev: any) => ({ ...prev, imagen: imageUrl, imagenFile: file }));
    }
  };

  const addBotonToForm = () => {
    const nuevoBoton = { texto: '', imagenAsociada: '' };
    const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
    updateFunc((prev: any) => ({ ...prev, botones: [...(prev?.botones || []), nuevoBoton] }));
  };

  const removeBotonFromForm = (btnIndex: number) => {
    const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
    updateFunc((prev: any) => ({
      ...prev,
      botones: prev.botones?.filter((_: any, index: number) => index !== btnIndex) || [],
    }));
  };

  const handleBotonTextChange = (index: number, value: string) => {
    const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
    updateFunc((prev: any) => {
      const updatedBotones = (prev?.botones || []).map((boton: any, i: number) => {
        if (i === index) {
          return { ...boton, texto: value };
        }
        return boton;
      });
      return { ...prev, botones: updatedBotones };
    });
  };

  const handleBotonImageChange = (index: number, file: File | null) => {
    if (!file) return;
    const updateFunc = editingEvento ? setEditingEvento : setAddingEvento;
    updateFunc((prev: any) => {
      const updatedBotones = (prev?.botones || []).map((boton: any, i: number) => {
        if (i === index) {
          return { ...boton, imagenAsociada: file };
        }
        return boton;
      });
      return { ...prev, botones: updatedBotones };
    });
  };

  const handleSubmitEvento = async (evento: Evento | Partial<Evento>) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('Titulo', evento.titulo!);
    formData.append('Descripcion', evento.descripcion!);
    if (evento.imagenFile) {
      formData.append('imagen', evento.imagenFile);
    }

    const subeventosData = (evento.botones || []).map(b => ({
      Titulo: b.texto,
      ID_SubEvento: b.ID_SubEvento,
      hasNewImage: b.imagenAsociada instanceof File
    }));
    formData.append('subeventos', JSON.stringify(subeventosData));

    (evento.botones || []).forEach(b => {
      if (b.imagenAsociada instanceof File) {
        formData.append('subeventosImages', b.imagenAsociada);
      }
    });

    try {
      if ('id' in evento && evento.id) {
        await api.put(`/eventos/update-evento/${evento.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/eventos/create-evento', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await fetchEventos();
      setEditingEvento(null);
      setAddingEvento(null);
    } catch (err) {
      console.error("Error al guardar el evento:", err);
      setError("Error al guardar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvento = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    setLoading(true);
    try {
      await api.delete(`/eventos/delete-evento/${id}`);
      await fetchEventos();
      if (editingEvento?.id === id) setEditingEvento(null);
    } catch (err) {
      console.error("Error al eliminar evento:", err);
      setError("Error al eliminar el evento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inicio') {
      fetchSliderImages();
      fetchEventos();
    }
    // Lógica para otras pestañas irá aquí
  }, [activeTab]);

  const settingsHero = {
    dots: true, infinite: true, speed: 500, slidesToShow: 1,
    slidesToScroll: 1, autoplay: true, fade: true, arrows: false
  };
  const currentFormEvento = editingEvento || addingEvento;

  useEffect(() => {
    if (currentFormEvento && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentFormEvento]);

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <h2>Panel de Administración</h2>
        <nav>
          <button className={activeTab === 'inicio' ? "active" : ''} onClick={() => setActiveTab('inicio')}>Inicio</button>
          <button className={activeTab === 'recursos' ? "active" : ''} onClick={() => setActiveTab('recursos')}>Recursos Electrónicos</button>
        </nav>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/admin/login');
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading-overlay"><span>Cargando...</span></div>}
        {error && <div className="error-message">{error} <button onClick={() => setError('')}>×</button></div>}

        {activeTab === 'inicio' && (
          <div>
            <h1>Administrar Página de Inicio</h1>
            <div className="admin-section">
              <h2>Slider Hero</h2>
              <div className="resource-form">
                <h3>Añadir Nueva Imagen</h3>
                <label htmlFor="hero-image-upload" className="file-upload-label">Seleccionar Archivo...</label>
                <input id="hero-image-upload" type="file" accept="image/*" onChange={handleHeroImageChange} style={{ display: 'none' }} />
              </div>
              <div className="hero-images-list">
                {heroImages.map(image => (
                  <div key={image.id} className="hero-image-item">
                    <img src={image.url} alt={image.name} />
                    <span>{image.name}</span>
                    <button onClick={() => handleDeleteHeroImage(image.id)} className="delete">Eliminar</button>
                  </div>
                ))}
              </div>
              {heroImages.length > 0 && (
                <div className="preview-section">
                  <h3>Vista Previa del Slider</h3>
                  <div className="hero-preview-wrapper">
                    <Slider {...settingsHero}>
                      {heroImages.map((image) => (
                        <div key={image.id}>
                          <img src={image.url} alt="Vista previa" className="hero-preview-image" />
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-section">
              <h2>Eventos del Carrusel</h2>
              <button onClick={handleShowAddEventoForm} className="add-button">+ Añadir Nuevo Evento</button>
              <div className="eventos-grid">
                {eventos.map((evento) => (
                  <div key={evento.id} className="evento-card" onClick={() => handleSelectEventoForEditing(evento)}>
                    <img src={evento.imagen} alt={evento.titulo} />
                    <h4>{evento.titulo}</h4>
                    <div className="card-actions"><button className="edit">Editar</button></div>
                  </div>
                ))}
              </div>
              
              {currentFormEvento && (
                <div ref={formRef} className="resource-form">
                  <h3>{editingEvento ? `Editando: ${currentFormEvento.titulo}` : 'Nuevo Evento'}</h3>
                  
                  {currentFormEvento.imagen && <img src={currentFormEvento.imagen} alt="Previsualización" className="form-image-preview" />}
                  <label htmlFor="evento-image-upload" className="file-upload-label">Imagen Principal...</label>
                  <input id="evento-image-upload" type="file" accept="image/*" onChange={handleEventoImageChange} style={{ display: 'none' }} />
                  
                  <input name="titulo" type="text" placeholder="Título del evento" value={currentFormEvento.titulo || ''} onChange={handleEventoFormChange} />
                  <textarea name="descripcion" placeholder="Descripción" value={currentFormEvento.descripcion || ''} onChange={handleEventoFormChange} />
                  
                  <h4>Botones de Sub-evento</h4>
                  {currentFormEvento.botones?.map((btn, index) => (
                    <div key={index} className="boton-item">
                      <input type="text" placeholder="Texto del botón" value={btn.texto} onChange={(e) => handleBotonTextChange(index, e.target.value)} />
                      {typeof btn.imagenAsociada === 'string' && btn.imagenAsociada.startsWith('http') ?
                        <img src={btn.imagenAsociada} alt="Sub-evento" className="form-image-preview-small" />
                        : btn.imagenAsociada instanceof File &&
                        <img src={URL.createObjectURL(btn.imagenAsociada)} alt="Previsualización" className="form-image-preview-small" />
                      }
                      <label htmlFor={`boton-image-${index}`} className="file-upload-label small">Imagen Botón...</label>
                      <input id={`boton-image-${index}`} type="file" accept="image/*" onChange={(e) => handleBotonImageChange(index, e.target.files?.[0] || null)} style={{ display: 'none' }}/>
                      <button onClick={() => removeBotonFromForm(index)} className="delete small">Quitar</button>
                    </div>
                  ))}
                  
                  <div className="form-actions">
                    <button type="button" onClick={addBotonToForm}>+ Agregar Botón</button>
                    <button type="button" onClick={() => handleSubmitEvento(currentFormEvento)} className="save">{editingEvento ? 'Guardar Cambios' : 'Crear Evento'}</button>
                    <button type="button" onClick={() => { setEditingEvento(null); setAddingEvento(null); }} className="cancel">Cancelar</button>
                    {editingEvento && (
                      <button type="button" onClick={() => handleDeleteEvento(editingEvento.id)} className="delete">Eliminar Evento</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recursos' && (
          <div>
            <h1>Administrar Recursos Electrónicos</h1>
            <p>Esta sección se construirá a continuación.</p>
          </div>
        )}
      </div>
    </div>
  );
}