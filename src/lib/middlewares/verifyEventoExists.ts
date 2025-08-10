// src/middlewares/verifyEventoExists.ts
import { NextRequest, NextResponse } from 'next/server';
import { Eventos } from '@/models/Eventos.model';

export const verifyEventoExists = async (req: NextRequest, { params }: { params: { id_evento: string } }) => {
  try {
    const { id_evento } = params;
    const evento = await Eventos.findByPk(id_evento, { include: ['SubEventos'] });

    if (!evento) {
      return NextResponse.json(
        { message: 'No se encontró el evento' },
        { status: 404 }
      );
    }

    return evento;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
};