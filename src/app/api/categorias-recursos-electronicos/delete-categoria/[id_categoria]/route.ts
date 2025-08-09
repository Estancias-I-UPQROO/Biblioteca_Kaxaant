import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';

export async function PATCH(
    req: Request,
    { params }: { params: { id_categoria: string } }
) {
    try {
        // Verificar JWT
        const authResponse = await verifyJWT(req as unknown as NextRequest);
        if (authResponse instanceof NextResponse) return authResponse;

        const { id_categoria } = params;

        // Verificar si la categoría existe
        const categoria = await verifyCategoriaExists(id_categoria);
        if (categoria instanceof NextResponse) return categoria;

        // Desactivar categoría
        await categoria.update({ Activo: false });

        return NextResponse.json(
            { message: 'Categoría desactivada exitosamente' },
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