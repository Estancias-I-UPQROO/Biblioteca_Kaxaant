import { NextRequest, NextResponse } from 'next/server';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { Rel_Categorias_Recursos_Electronicos } from '@/models/Rel_Categorias_Recursos_Electronicos.model';
import { connectDB } from '@/lib/db';
import { Recursos_Electronicos } from '@/models/Recursos_Electronicos.model';
import { setupRelations } from '@/models';

export async function GET(
  req: NextRequest,
  { params }: { params: { id_categoria: string } }
) {
  try {
    await connectDB();
    
    const { id_categoria } = await params;
    const isAdmin = !!(await optionalVerifyJWT(req));

    // Verificar si la categoría existe
    const categoria = await verifyCategoriaExists(id_categoria);
    if (categoria instanceof NextResponse) return categoria;

    const recursos = await Rel_Categorias_Recursos_Electronicos.findAll({
      where: { ID_Categoria_Recursos_Electronicos: id_categoria },
      include: [{
        model: Recursos_Electronicos,
        as: 'recurso', // Usa el mismo alias que definiste en las relaciones
        where: isAdmin ? {} : { Activo: true },
      }],
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