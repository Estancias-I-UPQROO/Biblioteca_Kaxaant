import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/middlewares/verifyJWT';
import { verifyRecursoExists } from '@/lib/middlewares/verifyRecursoExists';
import { handleFileUpload, deleteFile } from '@/lib/fileUpload';
import { z } from 'zod';
import { connectDB } from '@/lib/db';

const schema = z.object({
  Nombre: z.string().min(1),
  Descripcion: z.string().min(1),
  Enlace_Pagina: z.string().url()
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id_recurso: string } }
) {
  try {
    // Verificar JWT
    await connectDB();
    const { id_recurso } = await params;
    const authResponse = await verifyJWT(req);
    if (authResponse instanceof NextResponse) return authResponse;


    // Verificar si el recurso existe
    const recurso = await verifyRecursoExists(id_recurso);
    if (recurso instanceof NextResponse) return recurso;

    // Procesar form-data
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    
    // Validar campos
    const validation = schema.safeParse({
      Nombre: body.Nombre,
      Descripcion: body.Descripcion,
      Enlace_Pagina: body.Enlace_Pagina
    });
    
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error },
        { status: 400 }
      );
    }

    // Procesar imagen si viene en la solicitud
    let imagenUrl = recurso.Imagen_URL;
    const file = formData.get('imagen');
    
    if (file instanceof File) {
      // Eliminar imagen anterior
      if (recurso.Imagen_URL) {
        await deleteFile(recurso.Imagen_URL, 'recursos');
      }
      
      // Subir nueva imagen
      imagenUrl = await handleFileUpload(formData, 'imagen', 'recursos') || imagenUrl;
    }

    // Actualizar recurso
    await recurso.update({
      Nombre: validation.data.Nombre,
      Descripcion: validation.data.Descripcion,
      Enlace_Pagina: validation.data.Enlace_Pagina,
      Imagen_URL: imagenUrl
    });

    return NextResponse.json(
      { message: "Recurso actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}