import { NextRequest, NextResponse } from 'next/server';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { Recursos_Electronicos } from '@/models/Recursos_Electronicos.model';
import { connectDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const isAdmin = !!(await optionalVerifyJWT(req));
    
    const recursos = await Recursos_Electronicos.findAll({
      where: isAdmin ? {} : { Activo: true },
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(recursos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}