"use client";

import React, { useState } from 'react';
import { RefreshCwIcon, MailIcon, PlusIcon, MinusIcon, XIcon } from 'lucide-react';
import axios from 'axios';

// 2. Renombramos el componente y lo exportamos por defecto
export default function RenovacionPage() {
  const [formData, setFormData] = useState({
    matricula: '',
    nombre_libro: [''],
  });

  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // El resto de tu lógica y funciones se mantiene exactamente igual.
  // ... (pega aquí todas tus funciones: handleChange, handleMatriculaChange, addLibro, etc.)

  const handleChange = (index: number, value: string) => {
    const updatedLibros = [...formData.nombre_libro];
    updatedLibros[index] = value;
    setFormData({ ...formData, nombre_libro: updatedLibros });
  };

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setFormData({ ...formData, matricula: value });
    }
  };

  const addLibro = () => {
    if (formData.nombre_libro.length < 3) {
      setFormData({ ...formData, nombre_libro: [...formData.nombre_libro, ''] });
    }
  };

  const removeLibro = (index: number) => {
    const updatedLibros = formData.nombre_libro.filter((_, i) => i !== index);
    setFormData({ ...formData, nombre_libro: updatedLibros });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRespuesta('');
    setCargando(true);

    if (!formData.matricula || formData.nombre_libro.some(libro => !libro.trim())) {
      setRespuesta('Por favor, completa todos los campos.');
      setMostrarModal(true);
      setCargando(false);
      return;
    }

    try {
      // 3. Actualizamos cómo se accede a la variable de entorno
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL_Correos;
      const { data } = await axios.post(`${BASE_URL}/enviar-correo-renovacion`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRespuesta('Solicitud de renovación enviada con éxito. Recibirás una confirmación por correo. Tienes 3 días hábiles para devolver el libro a la biblioteca.');
      setFormData({ matricula: '', nombre_libro: [''] });
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
    <main className="min-h-screen bg-white text-gray-900 px-4 py-14 flex justify-center font-['Inter']">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <RefreshCwIcon className="text-orange-500 w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight">
            Renovación en línea
          </h1>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Puedes renovar tu préstamo desde casa siempre que la renovación del préstamo se encuentre exactamente los días de vencimiento. Recibirás confirmación por correo.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matrícula:</label>
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
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Solo números (máx. 9)"
            />
          </div>

          {formData.nombre_libro.map((libro, index) => (
            <div key={index} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del libro {formData.nombre_libro.length > 1 && `(${index + 1})`}:
              </label>
              <input
                type="text"
                value={libro}
                onChange={(e) => handleChange(index, e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              {formData.nombre_libro.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLibro(index)}
                  className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                >
                  <MinusIcon size={18} />
                </button>
              )}
            </div>
          ))}

          {formData.nombre_libro.length < 3 && (
            <button
              type="button"
              onClick={addLibro}
              className="text-sm text-orange-600 hover:underline flex items-center gap-1"
            >
              <PlusIcon size={16} /> Agregar otro libro
            </button>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cargando ? 'Enviando...' : 'Enviar solicitud'}
            <MailIcon className="w-4 h-4" />
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
                  {respuesta.includes('éxito') ? '¡Éxito!' : 'Atención'}
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
};