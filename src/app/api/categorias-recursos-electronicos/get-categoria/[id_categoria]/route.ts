import { NextRequest, NextResponse } from 'next/server';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';
import { connectDB } from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: { id_categoria: string } }
) {
    try {
        await connectDB();
        const { id_categoria } = await params;
        
        // Verificar si la categoría existe
        const categoria = await verifyCategoriaExists(id_categoria);
        if (categoria instanceof NextResponse) return categoria;

        // Verificar JWT opcional
        const isAdmin = !!(await optionalVerifyJWT(req as unknown as NextRequest));

        // Si no es admin y la categoría no está activa
        if (!isAdmin && !categoria.Activo) {
            return NextResponse.json(
                { message: 'No tienes permiso para ver esta categoría' },
                { status: 403 }
            );
        }

        return NextResponse.json(categoria);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}