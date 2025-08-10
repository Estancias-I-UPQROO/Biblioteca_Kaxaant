// src/app/api/eventos/get-eventos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SubEventos } from '@/models/SubEventos.model';
import { Eventos } from '@/models/Eventos.model';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { connectDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await optionalVerifyJWT(req);

    let whereCondition = {};
    if (!isAdmin || isAdmin instanceof NextResponse) {
      whereCondition = { Activo: true };
    }

    const eventos = await Eventos.findAll({
      where: whereCondition,
      include: [{
        model: SubEventos,
        as: 'SubEventos'
      }],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(eventos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}