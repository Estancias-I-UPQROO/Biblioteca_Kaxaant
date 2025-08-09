import { Categorias_Recursos_Electronicos } from '@/models/Categorias_Recursos_Electronicos.model';
import { NextResponse } from 'next/server';

export const verifyDuplicatedCategoria = async (Nombre: string, id_categoria?: string) => {
    try {
        const duplicatedCategoria = await Categorias_Recursos_Electronicos.findOne({ where: { Nombre } });

        if (duplicatedCategoria && id_categoria !== duplicatedCategoria.ID_Categoria_Recursos_Electronicos) {
            return NextResponse.json(
                { message: 'La categoría introducida ya existe en los registros!' },
                { status: 409 }
            );
        }

        return null;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Error interno del servidor!' },
            { status: 500 }
        );
    }
};