// src/app/api/eventos/update-evento/[id_evento]/route.ts
import { connectDB } from '@/lib/db';
import { deleteFile, handleFileUpload } from '@/lib/fileUpload';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { Eventos } from '@/models/Eventos.model';
import { SubEventos } from '@/models/SubEventos.model';
import { NextRequest, NextResponse } from 'next/server';

interface EventoWithSubEventos extends Eventos {
  SubEventos?: SubEventos[];
}

export async function PUT(req: NextRequest, { params }: { params: { id_evento: string } }) {
  try {
    // Verificar JWT y conectar DB
    await connectDB();
    const admin = await verifyJWT(req);
    if (admin instanceof NextResponse) return admin;

    const { id_evento } = params;
    const evento = await Eventos.findByPk(id_evento, { 
      include: [{ model: SubEventos, as: 'SubEventos' }]
    }) as EventoWithSubEventos;
    
    if (!evento) {
      return NextResponse.json(
        { message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    // Procesar imagen principal si se proporciona
    const imagenFile = formData.get('imagen') as File | null;
    let imagenUrl = evento.Imagen_URL;

    if (imagenFile && imagenFile.size > 0) {
      // Eliminar imagen anterior
      if (evento.Imagen_URL) {
        await deleteFile(evento.Imagen_URL, 'eventos');
      }
      // Subir nueva imagen
      imagenUrl = await handleFileUpload(formData, 'imagen', 'eventos') || evento.Imagen_URL;
    }

    // Procesar datos del formulario
    const titulo = formData.get('Titulo') as string;
    const descripcion = formData.get('Descripcion') as string;
    const subeventos = formData.get('subeventos') as string;

    // Actualizar campos básicos
    await evento.update({
      Titulo: titulo || evento.Titulo,
      Descripcion: descripcion || evento.Descripcion,
      Imagen_URL: imagenUrl
    });

    // Procesar subeventos
    const subeventosArray = subeventos ? JSON.parse(subeventos) : [];
    const subeventosFiles = formData.getAll('subeventosImages') as File[];

    // Mapeo de subeventos existentes
    const existentesMap = new Map();
    if (evento.SubEventos) {
      evento.SubEventos.forEach(se => existentesMap.set(se.ID_SubEvento, se));
    }

    const idsRecibidos = subeventosArray.map((se: any) => se.ID_SubEvento).filter(Boolean);

    // Procesar subeventos
    for (let i = 0; i < subeventosArray.length; i++) {
      const se = subeventosArray[i];
      const subeventoFile = subeventosFiles[i];
      const existingSub = se.ID_SubEvento ? existentesMap.get(se.ID_SubEvento) : null;

      if (existingSub) {
        // Actualizar subevento existente
        if (subeventoFile && subeventoFile.size > 0) {
          if (existingSub.Imagen_URL) {
            await deleteFile(existingSub.Imagen_URL, 'eventos');
          }
          
          // Crear nuevo FormData para el archivo
          const subeventoFormData = new FormData();
          subeventoFormData.append('file', subeventoFile);
          
          const newImageUrl = await handleFileUpload(subeventoFormData, 'file', 'eventos');
          if (newImageUrl) {
            existingSub.Imagen_URL = newImageUrl;
          }
        }
        existingSub.Titulo = se.Titulo;
        await existingSub.save();
      } else if (se.Titulo) {
        // Crear nuevo subevento
        let newImageUrl = se.Imagen_URL || null;
        
        if (subeventoFile && subeventoFile.size > 0) {
          // Crear nuevo FormData para el archivo
          const subeventoFormData = new FormData();
          subeventoFormData.append('file', subeventoFile);
          
          newImageUrl = await handleFileUpload(subeventoFormData, 'file', 'eventos');
        }

        if (newImageUrl) {
          await SubEventos.create({
            ID_Evento: evento.ID_Evento,
            Titulo: se.Titulo,
            Imagen_URL: newImageUrl
          });
        }
      }
    }

    // Eliminar subeventos no incluidos en la solicitud
    if (evento.SubEventos) {
      for (const subevento of evento.SubEventos) {
        if (!idsRecibidos.includes(subevento.ID_SubEvento)) {
          if (subevento.Imagen_URL) {
            await deleteFile(subevento.Imagen_URL, 'eventos');
          }
          await subevento.destroy();
        }
      }
    }

    return NextResponse.json(
      { message: "Evento actualizado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}