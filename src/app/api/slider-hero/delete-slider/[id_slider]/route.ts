import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifySliderExists } from '@/lib/middlewares/verifySliderExists';
import { deleteFile } from '@/lib/fileUpload';
import { connectDB } from '@/lib/db';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id_slider: string } }
) {
    try {
        // Verificar JWT
        await connectDB();
        const authResponse = await verifyJWT(req);
        if (authResponse instanceof NextResponse) return authResponse;

        const { id_slider } = params;

        // Verificar si el slider existe
        const slider = await verifySliderExists(id_slider);
        if (slider instanceof NextResponse) return slider;

        // Eliminar el archivo de imagen
        await deleteFile(slider.Imagen_URL, 'sliders');

        // Eliminar el registro de la base de datos
        await slider.destroy();

        return NextResponse.json(
            { message: "Imagen del slider eliminada exitosamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al eliminar imagen del slider:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}