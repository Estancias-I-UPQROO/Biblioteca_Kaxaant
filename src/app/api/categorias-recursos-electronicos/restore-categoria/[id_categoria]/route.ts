import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';
import { connectDB } from '@/lib/db';

export async function PATCH(
    req: Request,
    { params }: { params: { id_categoria: string } }
) {
    try {
        await connectDB();
        // Verificar JWT
        const { id_categoria } = await params;
        const authResponse = await verifyJWT(req as unknown as NextRequest);
        if (authResponse instanceof NextResponse) return authResponse;


        // Verificar si la categoría existe
        const categoria = await verifyCategoriaExists(id_categoria);
        if (categoria instanceof NextResponse) return categoria;

        // Reactivar categoría
        await categoria.update({ Activo: true });

        return NextResponse.json(
            { message: 'Categoría reactivada exitosamente' },
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