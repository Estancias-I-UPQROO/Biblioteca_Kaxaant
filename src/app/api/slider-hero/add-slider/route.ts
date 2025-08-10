import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { handleFileUpload } from '@/lib/fileUpload';
import { Slider_Hero } from '@/models/Slider_Hero.model';

export async function POST(req: NextRequest) {
    try {
        // Verificar JWT
        const authResponse = await verifyJWT(req);
        if (authResponse instanceof NextResponse) return authResponse;

        // Procesar la imagen
        const imagenUrl = await handleFileUpload(req, 'imagen', 'sliders');
        if (!imagenUrl) {
            return NextResponse.json(
                { message: 'Imagen no proporcionada' },
                { status: 400 }
            );
        }

        // Crear el slider en la base de datos
        const slider = await Slider_Hero.create({ Imagen_URL: imagenUrl });

        return NextResponse.json(
            { 
                message: "Imagen del slider agregada", 
                data: slider 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al agregar imagen del slider:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}