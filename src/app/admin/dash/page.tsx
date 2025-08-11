// RUTA: src/app/admin/dashboard/page.tsx
"use client";

import React, { useState, type ChangeEvent, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Admindash.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Recurso, RecursosPorCategoria } from '@/types/RecursosPorCategoriaProps';
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

  // --- Estados para Recursos Electrónicos ---
  const [categorias, setCategorias] = useState<any[]>([]);
  const [recursos, setRecursos] = useState<RecursosPorCategoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [editingResource, setEditingResource] = useState<any | null>(null);
  const [resourceForm, setResourceForm] = useState({
    Nombre: '',
    Descripcion: '',
    Enlace_Pagina: ''
  });
  const [resourcePreview, setResourcePreview] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    Nombre: '',
    Descripcion: '',
    Enlace_Pagina: '',
    Imagen: ''
  });

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

  // --- Funciones para Recursos Electrónicos ---
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categorias-recursos-electronicos/get-categorias');
      setCategorias(response.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecursos = async (idCategoria: string) => {
    if (!idCategoria) return;
    setLoading(true);
    try {
      const { data } = await api.get<RecursosPorCategoria[]>(`/recursos-electronicos/get-recursos/${idCategoria}`);
      setRecursos(data);
    } catch (err) {
      console.error("Error al obtener recursos:", err);
      setError("No se pudieron cargar los recursos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (idCategoria: string) => {
    const categoria = categorias.find(c => c.ID_Categoria_Recursos_Electronicos === idCategoria);
    setSelectedCategory(idCategoria);
    setSelectedCategoryName(categoria?.Nombre || '');
    setEditingResource(null);
    setResourceForm({
      Nombre: '',
      Descripcion: '',
      Enlace_Pagina: '',
    });
    setResourcePreview('');
    fetchRecursos(idCategoria);
  };

  const handleResourceImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setResourcePreview(imageUrl);
      setValidationErrors(prev => ({
        ...prev,
        Imagen: ''
      }));
    }
  };

  const handleResourceFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResourceForm(prev => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSelectResourceForEditing = (categoria: RecursosPorCategoria) => {
    const { recurso } = categoria;
    setEditingResource(recurso);
    setResourceForm({
      Nombre: recurso.Nombre,
      Descripcion: recurso.Descripcion,
      Enlace_Pagina: recurso.Enlace_Pagina
    });
    setResourcePreview('');
  };

  const handleSubmitResource = async () => {
    if (!selectedCategory) return;

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('Nombre', resourceForm.Nombre);
    formData.append('Descripcion', resourceForm.Descripcion);
    formData.append('Enlace_Pagina', resourceForm.Enlace_Pagina);

    if (resourcePreview) {
      const fileInput = document.getElementById('resource-image-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('imagen', fileInput.files[0]);
      }
    }

    setLoading(true);
    try {
      if (editingResource) {
        await api.put(`/recursos-electronicos/update-recurso/${editingResource.ID_Recurso_Electronico}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(`/recursos-electronicos/create-recurso/${selectedCategory}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      await fetchRecursos(selectedCategory);
      setEditingResource(null);
      setResourceForm({
        Nombre: '',
        Descripcion: '',
        Enlace_Pagina: '',
      });
      setResourcePreview('');
      setValidationErrors({
        Nombre: '',
        Descripcion: '',
        Enlace_Pagina: '',
        Imagen: ''
      });
    } catch (err) {
      console.error("Error al guardar recurso:", err);
      setError("Error al guardar el recurso.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResourceStatus = async (idRecurso: string, activo: boolean) => {
    setLoading(true);
    try {
      if (activo) {
        await api.patch(`/recursos-electronicos/restore-recurso/${idRecurso}`);
      } else {
        await api.patch(`/recursos-electronicos/delete-recurso/${idRecurso}`);
      }
      await fetchRecursos(selectedCategory!);
      setEditingResource(null);
    } catch (err) {
      console.error("Error al cambiar estado del recurso:", err);
      setError("Error al cambiar el estado del recurso.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      Nombre: '',
      Descripcion: '',
      Enlace_Pagina: '',
      Imagen: ''
    };
    let isValid = true;

    // Validar Nombre
    if (!resourceForm.Nombre.trim()) {
      errors.Nombre = 'El nombre es requerido';
      isValid = false;
    } else if (resourceForm.Nombre.length > 100) {
      errors.Nombre = 'El nombre no debe exceder los 100 caracteres';
      isValid = false;
    }

    // Validar Descripción
    if (!resourceForm.Descripcion.trim()) {
      errors.Descripcion = 'La descripción es requerida';
      isValid = false;
    }

    // Validar URL
    if (!resourceForm.Enlace_Pagina.trim()) {
      errors.Enlace_Pagina = 'La URL es requerida';
      isValid = false;
    } else {
      try {
        new URL(resourceForm.Enlace_Pagina);
      } catch (e) {
        errors.Enlace_Pagina = 'Ingrese una URL válida (ej: https://ejemplo.com)';
        isValid = false;
      }
    }

    // Validar Imagen (solo para creación)
    if (!editingResource && !resourcePreview) {
      errors.Imagen = 'La imagen es requerida';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };


  useEffect(() => {
    if (activeTab === 'inicio') {
      fetchSliderImages();
      fetchEventos();
    }

    if (activeTab === 'recursos') {
      fetchCategorias();
    }
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
                      <input id={`boton-image-${index}`} type="file" accept="image/*" onChange={(e) => handleBotonImageChange(index, e.target.files?.[0] || null)} style={{ display: 'none' }} />
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

            {/* Sección de Categorías */}
            <div className="admin-section">
              <h2>Categorías</h2>
              <div className="categories-scroll-container">
                <div className="categories-list">
                  {categorias.map(categoria => (
                    <button
                      key={categoria.ID_Categoria_Recursos_Electronicos}
                      className={`category-button ${selectedCategory === categoria.ID_Categoria_Recursos_Electronicos ? 'active' : ''}`}
                      onClick={() => handleSelectCategory(categoria.ID_Categoria_Recursos_Electronicos)}
                    >
                      {categoria.Nombre}
                      {!categoria.Activo && <span className="inactive-badge">Inactivo</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección de Recursos */}
            {selectedCategory && (
              <div className="admin-section">
                <h2>Recursos de la categoría: {selectedCategoryName}</h2>

                {/* Formulario de Recurso - Siempre visible cuando hay categoría seleccionada */}
                <div className="resource-form">
                  <h3>{editingResource ? `Editando: ${editingResource.Nombre}` : 'Nuevo Recurso'}</h3>

                  {/* Previsualización de imagen */}
                  {(resourcePreview || editingResource?.Imagen_URL) && (
                    <img
                      src={resourcePreview || `http://localhost:4501${editingResource?.Imagen_URL}`}
                      alt="Previsualización"
                      className="form-image-preview"
                    />
                  )}

                  <label htmlFor="resource-image-upload" className="file-upload-label">
                    {resourcePreview || editingResource ? 'Cambiar Imagen...' : 'Seleccionar Imagen...'}
                  </label>
                  <input
                    id="resource-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleResourceImageChange}
                    style={{ display: 'none' }}
                  />
                  {!editingResource && validationErrors.Imagen && (
                    <p className="error-message">{validationErrors.Imagen}</p>
                  )}

                  <input
                    name="Nombre"
                    type="text"
                    placeholder="Nombre del recurso"
                    value={resourceForm.Nombre || ''}
                    onChange={handleResourceFormChange}
                    className={validationErrors.Nombre ? 'has-error' : ''}
                  />
                  {validationErrors.Nombre && (
                    <p className="error-message">{validationErrors.Nombre}</p>
                  )}

                  <textarea
                    name="Descripcion"
                    placeholder="Descripción"
                    value={resourceForm.Descripcion || ''}
                    onChange={handleResourceFormChange}
                    className={validationErrors.Descripcion ? 'has-error' : ''}
                  />
                  {validationErrors.Descripcion && (
                    <p className="error-message">{validationErrors.Descripcion}</p>
                  )}

                  <input
                    name="Enlace_Pagina"
                    type="url"
                    placeholder="URL del recurso (https://...)"
                    value={resourceForm.Enlace_Pagina || ''}
                    onChange={handleResourceFormChange}
                    className={validationErrors.Enlace_Pagina ? 'has-error' : ''}
                  />
                  {validationErrors.Enlace_Pagina && (
                    <p className="error-message">{validationErrors.Enlace_Pagina}</p>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleSubmitResource}
                      className="save"
                    >
                      {editingResource ? 'Guardar Cambios' : 'Crear Recurso'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingResource(null);
                        setResourceForm({
                          Nombre: '',
                          Descripcion: '',
                          Enlace_Pagina: '',
                        });
                        setResourcePreview('');
                      }}
                      className="cancel"
                    >
                      Cancelar
                    </button>

                    {editingResource && (
                      <button
                        type="button"
                        onClick={() => handleToggleResourceStatus(editingResource.ID_Recurso_Electronico, !editingResource.Activo)}
                        className={editingResource.Activo ? 'deactivate' : 'activate'}
                      >
                        {editingResource.Activo ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de Recursos */}
                <div className="resources-container">
                  <div className="resources-grid">
                    {recursos.length > 0 ? (
                      recursos.map(categoria => (
                        categoria && (
                          <div
                            key={categoria.recurso.ID_Recurso_Electronico}
                            className={`resource-card ${!categoria.recurso.Activo ? 'inactive' : ''}`}
                            onClick={() => handleSelectResourceForEditing(categoria)}
                          >
                            <div className="resource-image-container">
                              <img
                                src={`http://localhost:4501${categoria.recurso.Imagen_URL}`}
                                alt={categoria.recurso.Nombre}
                              />
                            </div>
                            <div className="resource-info">
                              <h4>{categoria.recurso.Nombre}</h4>
                              <p className="description">
                                {categoria.recurso.Descripcion}
                              </p>
                              <div className='resource-actions-container'>
                                <a
                                  href={categoria.recurso.Enlace_Pagina}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="resource-link"
                                >
                                  Visitar Recurso
                                </a>
                                <button
                                  className={`status-button ${categoria.recurso.Activo ? 'active' : 'inactive'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleResourceStatus(categoria.recurso.ID_Recurso_Electronico, !categoria.recurso.Activo);
                                  }}
                                >
                                  {categoria.recurso.Activo ? 'Activado' : 'Desactivado'}
                                </button>
                              </div>
                            </div>
                            {!categoria.recurso.Activo && <span className="inactive-badge">Inactivo</span>}
                          </div>
                        )
                      ))
                    ) : (
                      <p className="no-resources">No hay recursos en esta categoría</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}