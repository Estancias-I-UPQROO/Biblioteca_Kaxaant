// src/app/api/eventos/delete-evento/[id_evento]/route.ts
import { connectDB } from '@/lib/db';
import { deleteFile } from '@/lib/fileUpload';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { Eventos } from '@/models/Eventos.model';
import { SubEventos } from '@/models/SubEventos.model';
import { NextRequest, NextResponse } from 'next/server';

interface EventoWithSubEventos extends Eventos {
  SubEventos?: SubEventos[];
}

export async function DELETE(req: NextRequest, { params }: { params: { id_evento: string } }) {
  try {
    // Verificar JWT
    await connectDB();
    const { id_evento } = await params;
    const admin = await verifyJWT(req);
    if (admin instanceof NextResponse) return admin;

    const evento = await Eventos.findByPk(id_evento, { 
      include: [{ model: SubEventos, as: 'SubEventos' }]
    }) as EventoWithSubEventos;
    
    if (!evento) {
      return NextResponse.json(
        { message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar imágenes de subeventos
    if (evento.SubEventos && evento.SubEventos.length > 0) {
      for (const subevento of evento.SubEventos) {
        if (subevento.Imagen_URL) {
          await deleteFile(subevento.Imagen_URL, 'eventos');
        }
        await subevento.destroy();
      }
    }

    // Eliminar imagen principal del evento
    if (evento.Imagen_URL) {
      await deleteFile(evento.Imagen_URL, 'eventos');
    }

    await evento.destroy();
    
    return NextResponse.json(
      { message: 'Evento eliminado correctamente' },
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