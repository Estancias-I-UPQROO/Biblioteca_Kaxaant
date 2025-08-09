import { Categorias_Recursos_Electronicos } from '@/models/Categorias_Recursos_Electronicos.model';
import { NextResponse } from 'next/server';

export const verifyCategoriaExists = async (id_categoria: string) => {
    try {
        const categoria = await Categorias_Recursos_Electronicos.findByPk(id_categoria);

        if (!categoria) {
            return NextResponse.json(
                { message: 'No se encontró la categoría introducida en los registros!' },
                { status: 409 }
            );
        }

        return categoria;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor!' },
            { status: 500 }
        );
    }
};