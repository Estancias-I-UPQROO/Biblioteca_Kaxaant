import { Recursos_Electronicos } from '@/models/Recursos_Electronicos.model';
import { NextResponse } from 'next/server';

export const verifyRecursoExists = async (id_recurso: string) => {
    try {
        const recurso = await Recursos_Electronicos.findByPk(id_recurso);

        if (!recurso) {
            return NextResponse.json(
                { message: 'No se encontró el recurso electrónico en los registros!' },
                { status: 404 }
            );
        }

        return recurso;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor!' },
            { status: 500 }
        );
    }
};