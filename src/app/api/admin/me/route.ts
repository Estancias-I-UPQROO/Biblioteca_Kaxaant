import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';

export async function GET(req: Request) {
    try {
        // Verificar JWT
        const authResponse = await verifyJWT(req as unknown as NextRequest);
        if (authResponse instanceof NextResponse) return authResponse;

        // Si verifyJWT pasa, authResponse es el admin
        const admin = authResponse!;

        return NextResponse.json(
            { ID_Admin: admin.ID_Admin },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error en /me:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}