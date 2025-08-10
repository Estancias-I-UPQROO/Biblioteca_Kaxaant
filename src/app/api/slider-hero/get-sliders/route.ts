import { connectDB } from '@/lib/db';
import { Slider_Hero } from '@/models/Slider_Hero.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();

        const sliders = await Slider_Hero.findAll({
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(sliders);
    } catch (error) {
        console.error("Error al obtener sliders:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}