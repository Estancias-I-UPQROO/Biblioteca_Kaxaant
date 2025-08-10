// RUTA: src/app/api/eventos/update-evento/[id_evento]/route.ts

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
    await connectDB();
    const admin = await verifyJWT(req);
    if (admin instanceof NextResponse) return admin;

    const { id_evento } = params;
    const evento = await Eventos.findByPk(id_evento, {
      include: [{ model: SubEventos, as: 'SubEventos' }]
    }) as EventoWithSubEventos;
    
    if (!evento) {
      return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 });
    }

    const formData = await req.formData();
    
    // --- Lógica de actualización del evento principal (sin cambios) ---
    const imagenFile = formData.get('imagen') as File | null;
    let imagenUrl = evento.Imagen_URL;
    if (imagenFile && imagenFile.size > 0) {
      if (evento.Imagen_URL) await deleteFile(evento.Imagen_URL, 'eventos');
      imagenUrl = await handleFileUpload(formData, 'imagen', 'eventos') || evento.Imagen_URL;
    }
    await evento.update({
      Titulo: formData.get('Titulo') as string || evento.Titulo,
      Descripcion: formData.get('Descripcion') as string || evento.Descripcion,
      Imagen_URL: imagenUrl
    });

    // --- LÓGICA DE SUB-EVENTOS CORREGIDA Y MEJORADA ---
    const subeventosArray = JSON.parse(formData.get('subeventos') as string || '[]');
    const subeventosFiles = formData.getAll('subeventosImages') as File[];
    
    const existingSubEventosMap = new Map((evento.SubEventos || []).map(se => [se.ID_SubEvento, se]));
    const receivedSubEventosIds = new Set(subeventosArray.map((se: any) => se.ID_SubEvento).filter(Boolean));
    
    let fileCounter = 0;

    for (const subeventoData of subeventosArray) {
      // Caso 1: Actualizar un sub-evento existente
      if (subeventoData.ID_SubEvento && existingSubEventosMap.has(subeventoData.ID_SubEvento)) {
        const subeventoToUpdate = existingSubEventosMap.get(subeventoData.ID_SubEvento)!;
        let subeventoImageUrl = subeventoToUpdate.Imagen_URL;

        // Si se envió una nueva imagen para este sub-evento existente
        if (subeventoData.hasNewImage) {
          const newImageFile = subeventosFiles[fileCounter++];
          if (subeventoToUpdate.Imagen_URL) {
            await deleteFile(subeventoToUpdate.Imagen_URL, 'eventos');
          }
          const tempFormData = new FormData();
          tempFormData.append('file', newImageFile);
          subeventoImageUrl = await handleFileUpload(tempFormData, 'file', 'eventos') || subeventoToUpdate.Imagen_URL;
        }

        await subeventoToUpdate.update({
          Titulo: subeventoData.Titulo,
          Imagen_URL: subeventoImageUrl
        });

      // Caso 2: Crear un sub-evento nuevo
      } else if (subeventoData.Titulo) {
        let newImageUrl = null;
        if (subeventoData.hasNewImage) {
          const newImageFile = subeventosFiles[fileCounter++];
          const tempFormData = new FormData();
          tempFormData.append('file', newImageFile);
          newImageUrl = await handleFileUpload(tempFormData, 'file', 'eventos');
        }

        if (newImageUrl) {
          await SubEventos.create({
            ID_Evento: evento.ID_Evento,
            Titulo: subeventoData.Titulo,
            Imagen_URL: newImageUrl
          });
        }
      }
    }

    // Caso 3: Eliminar sub-eventos que ya no están en la lista
    for (const [id, subevento] of existingSubEventosMap.entries()) {
      if (!receivedSubEventosIds.has(id)) {
        if (subevento.Imagen_URL) {
          await deleteFile(subevento.Imagen_URL, 'eventos');
        }
        await subevento.destroy();
      }
    }

    return NextResponse.json({ message: "Evento actualizado correctamente" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}