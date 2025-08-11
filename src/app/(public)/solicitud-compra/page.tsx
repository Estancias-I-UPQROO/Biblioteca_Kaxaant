"use client";

import React, { useState } from 'react';
import { MessageSquareIcon, XIcon } from 'lucide-react';
import axios from 'axios';

export default function SugerenciasPage() {
  const [formData, setFormData] = useState({
    matricula: '',
    titulo: '',
    autor_editorial: '',
    tema: '',
    anio_publicacion: '',
  });

  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setFormData({
        ...formData,
        matricula: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRespuesta('');
    setCargando(true);

    // Validación de campos obligatorios
    if (!formData.matricula || !formData.titulo || !formData.autor_editorial) {
      setRespuesta('Por favor, completa los campos obligatorios: Matrícula, Título y Autor/Editorial.');
      setMostrarModal(true);
      setCargando(false);
      return;
    }

    // Validación de año
    const anio = parseInt(formData.anio_publicacion, 10);
    const maxAnio = new Date().getFullYear();
    if (isNaN(anio) || anio < 868 || anio > maxAnio) {
      setRespuesta(`El año de publicación debe estar entre 868 y ${maxAnio}.`);
      setMostrarModal(true);
      setCargando(false);
      return;
    }

    try {
      await axios.post(
        "http://academico.upqroo.edu.mx/api/correos/enviar-correo-sugerencia-material",
        formData
      );

      setRespuesta('¡Gracias por tu sugerencia! Si tu solicitud es aceptada, recibirás un correo de confirmación. Será revisada por el equipo de la Biblioteca.');
      setFormData({
        matricula: '',
        titulo: '',
        autor_editorial: '',
        tema: '',
        anio_publicacion: '',
      });
    } catch (error: any) {
      if (error.response?.data) {
        setRespuesta(`Error: ${error.response.data}`);
      } else {
        setRespuesta('Error en la conexión con el servidor. Intenta de nuevo más tarde.');
      }
    } finally {
      setMostrarModal(true);
      setCargando(false);
    }
  };


  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-14 flex justify-center font-['Inter']">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquareIcon className="text-orange-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
            Sugerencias de material de compra
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-gray-700 mb-8">
          La Biblioteca acepta sugerencias de material bibliográfico que sea de interés para la comunidad UPQROO, con el objetivo de constituir un acervo amplio en apoyo a la comunidad universitaria.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula*:
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleMatriculaChange}
              required
              minLength={9}
              maxLength={9}
              pattern="\d*"
              inputMode="numeric"
              placeholder="Solo números (máx. 9)"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título*:
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="autor_editorial" className="block text-sm font-medium text-gray-700 mb-1">
              Autor/Editorial*:
            </label>
            <input
              type="text"
              id="autor_editorial"
              name="autor_editorial"
              value={formData.autor_editorial}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">
              Tema:
            </label>
            <input
              type="text"
              id="tema"
              name="tema"
              value={formData.tema}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="anio_publicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Año de publicación:
            </label>
            <input
              type="number"
              id="anio_publicacion"
              name="anio_publicacion"
              value={formData.anio_publicacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {formData.anio_publicacion && parseInt(formData.anio_publicacion) < 868 && (
              <p className="text-red-500 text-sm mt-1">El año mínimo permitido es 868</p>
            )}
          </div>
          <button
            type="submit"
            disabled={cargando}
            className={`inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'Enviando...' : 'Enviar sugerencia'}
          </button>
        </form>

        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XIcon size={24} />
              </button>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">
                  {respuesta.includes('¡Gracias') ? '¡Éxito!' : 'Atención'}
                </h3>
                <p className="text-gray-700">{respuesta}</p>
                <button
                  onClick={cerrarModal}
                  className="mt-4 bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
