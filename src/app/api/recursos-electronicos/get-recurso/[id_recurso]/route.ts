import { NextRequest, NextResponse } from 'next/server';
import { verifyRecursoExists } from '@/lib/middlewares/verifyRecursoExists';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { connectDB } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id_recurso: string } }
) {
  try {
    await connectDB();

    const { id_recurso } = await params;
    const isAdmin = !!(await optionalVerifyJWT(req));

    // Verificar si el recurso existe
    const recurso = await verifyRecursoExists(id_recurso);
    if (recurso instanceof NextResponse) return recurso;

    // Si no es admin y el recurso no está activo
    if (!isAdmin && !recurso.Activo) {
      return NextResponse.json(
        { message: "No tienes permiso para ver este recurso" },
        { status: 403 }
      );
    }

    return NextResponse.json(recurso);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}