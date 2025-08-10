// src/app/api/eventos/create-evento/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Eventos } from '@/models/Eventos.model';
import { SubEventos } from '@/models/SubEventos.model';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { handleFileUpload } from '@/lib/fileUpload';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Verificar JWT
    await connectDB();
    const admin = await verifyJWT(req);
    if (admin instanceof NextResponse) return admin;

    const formData = await req.formData();
    
    // Procesar imagen principal
    const imagenUrl = await handleFileUpload(formData, 'imagen', 'eventos');
    if (!imagenUrl) {
      return NextResponse.json(
        { message: 'Imagen principal no proporcionada' },
        { status: 400 }
      );
    }

    // Procesar datos del formulario
    const titulo = formData.get('Titulo') as string;
    const descripcion = formData.get('Descripcion') as string;
    const subeventos = formData.get('subeventos') as string;

    if (!titulo || !descripcion) {
      return NextResponse.json(
        { message: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    const subeventosArray = subeventos ? JSON.parse(subeventos) : [];
    const subeventosFiles = formData.getAll('subeventosImages') as File[];

    // Crear el evento principal
    const evento = await Eventos.create({ 
      Titulo: titulo, 
      Descripcion: descripcion, 
      Imagen_URL: imagenUrl 
    });

    // Crear los subeventos con sus imágenes correspondientes
    for (let i = 0; i < subeventosArray.length; i++) {
      const se = subeventosArray[i];
      if (!se.Titulo) continue;

      // Crear nuevo FormData para cada subevento
      const subeventoFormData = new FormData();
      subeventoFormData.append('file', subeventosFiles[i]);

      const imagenUrl = subeventosFiles[i]
        ? await handleFileUpload(subeventoFormData, 'file', 'eventos')
        : se.Imagen_URL || null;

      if (imagenUrl) {
        await SubEventos.create({
          ID_Evento: evento.ID_Evento,
          Titulo: se.Titulo,
          Imagen_URL: imagenUrl,
        });
      }
    }

    return NextResponse.json(
      { message: "Evento creado correctamente", data: evento },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}