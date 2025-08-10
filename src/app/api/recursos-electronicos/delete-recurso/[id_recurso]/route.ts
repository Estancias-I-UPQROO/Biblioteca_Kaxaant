import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyRecursoExists } from '@/lib/middlewares/verifyRecursoExists';
import { connectDB } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id_recurso: string } }
) {
  try {
    // Verificar JWT
    await connectDB();
    const { id_recurso } = await params;
    const authResponse = await verifyJWT(req);
    if (authResponse instanceof NextResponse) return authResponse;


    // Verificar si el recurso existe
    const recurso = await verifyRecursoExists(id_recurso);
    if (recurso instanceof NextResponse) return recurso;

    // Desactivar recurso (soft delete)
    await recurso.update({ Activo: false });

    return NextResponse.json(
      { message: "Recurso electrónico desactivado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}