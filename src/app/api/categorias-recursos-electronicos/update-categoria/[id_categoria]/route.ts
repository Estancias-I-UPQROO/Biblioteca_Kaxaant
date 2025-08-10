import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';
import { verifyDuplicatedCategoria } from '@/lib/middlewares/verifyDuplicatedCategoria';
import { connectDB } from '@/lib/db';

export async function PUT(
    req: Request,
    { params }: { params: { id_categoria: string } }
) {
    try {
        await connectDB();
        // Verificar JWT
        const { id_categoria } = await params;
        const authResponse = await verifyJWT(req as unknown as NextRequest);
        if (authResponse instanceof NextResponse) return authResponse;

        const body = await req.json();
        const { Nombre } = body;

        // Verificar si la categoría existe
        const categoria = await verifyCategoriaExists(id_categoria);
        if (categoria instanceof NextResponse) return categoria;

        // Validaciones (reemplazar con Zod)
        if (!Nombre || typeof Nombre !== 'string' || Nombre.length > 100) {
            return NextResponse.json(
                { message: 'El nombre debe ser una cadena de texto y no exceder 100 caracteres' },
                { status: 400 }
            );
        }

        // Verificar categoría duplicada
        const duplicatedResponse = await verifyDuplicatedCategoria(Nombre, id_categoria);
        if (duplicatedResponse instanceof NextResponse) return duplicatedResponse;

        // Actualizar categoría
        await categoria.update({ Nombre });
        await categoria.save();

        return NextResponse.json(
            { message: 'Categoría actualizada exitosamente' },
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