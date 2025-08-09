import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { Categorias_Recursos_Electronicos } from '@/models/Categorias_Recursos_Electronicos.model';

export async function POST(req: Request) {
    try {
        // Verificar JWT
        const authResponse = await verifyJWT(req as unknown as NextRequest);
        if (authResponse instanceof NextResponse) return authResponse;

        const body = await req.json();
        const { Nombre } = body;

        // Validaciones (reemplazar con Zod)
        if (!Nombre || typeof Nombre !== 'string' || Nombre.length > 100) {
            return NextResponse.json(
                { message: 'El nombre debe ser una cadena de texto y no exceder 100 caracteres' },
                { status: 400 }
            );
        }

        // Verificar categoría duplicada
        const duplicatedCategoria = await Categorias_Recursos_Electronicos.findOne({ where: { Nombre } });
        if (duplicatedCategoria) {
            return NextResponse.json(
                { message: 'La categoría introducida ya existe en los registros!' },
                { status: 409 }
            );
        }

        // Crear categoría
        await Categorias_Recursos_Electronicos.create({ Nombre });

        return NextResponse.json(
            { message: 'Categoría para recursos electrónicos agregada exitosamente' },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}