import { NextRequest, NextResponse } from 'next/server';
import { optionalVerifyJWT } from '@/lib/middlewares/optionalVerifyJWT';
import { Categorias_Recursos_Electronicos } from '@/models/Categorias_Recursos_Electronicos.model';
import { connectDB } from '@/lib/db';

export async function GET(req: Request) {
    try {
        await connectDB();

        const isAdmin = !!(await optionalVerifyJWT(req as unknown as NextRequest));

        const categorias = await Categorias_Recursos_Electronicos.findAll({
            where: isAdmin ? {} : { Activo: true },
            order: [['updatedAt', 'ASC']]
        });

        return NextResponse.json(categorias);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}