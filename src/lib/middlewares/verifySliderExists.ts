import { Slider_Hero } from '@/models/Slider_Hero.model';
import { NextResponse } from 'next/server';

export const verifySliderExists = async (id_slider: string) => {
    try {
        const slider = await Slider_Hero.findByPk(id_slider);

        if (!slider) {
            return NextResponse.json(
                { message: 'No se encontró el slider en los registros!' },
                { status: 404 }
            );
        }

        return slider;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor!' },
            { status: 500 }
        );
    }
};