import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyCategoriaExists } from '@/lib/middlewares/verifyCategoriaExists';
import { handleFileUpload } from '@/lib/fileUpload';
import { z } from 'zod';
import { Recursos_Electronicos } from '@/models/Recursos_Electronicos.model';
import { Rel_Categorias_Recursos_Electronicos } from '@/models/Rel_Categorias_Recursos_Electronicos.model';
import { connectDB } from '@/lib/db';

const schema = z.object({
  Nombre: z.string().min(1, "El nombre es requerido"),
  Descripcion: z.string().min(1, "La descripción es requerida"),
  Enlace_Pagina: z.string().url("Debe ser una URL válida")
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id_categoria: string } }
) {
  try {
    await connectDB();
    // Verificar JWT
    const { id_categoria } = await params;
    const authResponse = await verifyJWT(req);
    if (authResponse instanceof NextResponse) return authResponse;

    // Extraer id_categoria de los params

    // Verificar si la categoría existe
    const categoria = await verifyCategoriaExists(id_categoria);
    if (categoria instanceof NextResponse) return categoria;

    // Procesar form-data (solo una vez)
    const formData = await req.formData();
    
    // Extraer campos del formulario
    const nombre = formData.get('Nombre') as string;
    const descripcion = formData.get('Descripcion') as string;
    const enlacePagina = formData.get('Enlace_Pagina') as string;

    // Validar campos no file
    const validation = schema.safeParse({
      Nombre: nombre,
      Descripcion: descripcion,
      Enlace_Pagina: enlacePagina
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: "Datos inválidos",
          errors: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Procesar imagen usando el formData ya extraído
    const imagenUrl = await handleFileUpload(formData, 'imagen', 'recursos');
    if (!imagenUrl) {
      return NextResponse.json(
        { message: 'Imagen no proporcionada o inválida' },
        { status: 400 }
      );
    }

    // Crear recurso
    const recurso = await Recursos_Electronicos.create({
      Nombre: validation.data.Nombre,
      Descripcion: validation.data.Descripcion,
      Imagen_URL: imagenUrl,
      Enlace_Pagina: validation.data.Enlace_Pagina
    });

    // Crear relación con categoría
    await Rel_Categorias_Recursos_Electronicos.create({
      ID_Recurso_Electronico: recurso.ID_Recurso_Electronico,
      ID_Categoria_Recursos_Electronicos: id_categoria
    });

    return NextResponse.json(
      { 
        message: "Recurso electrónico agregado exitosamente",
        data: {
          ID_Recurso_Electronico: recurso.ID_Recurso_Electronico,
          Imagen_URL: recurso.Imagen_URL
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en create-recurso:', error);
    
    let errorMessage = "Error interno del servidor";
    if (error.message === 'Tipo de archivo no permitido') {
      errorMessage = "Solo se permiten imágenes JPEG, PNG o WEBP";
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}