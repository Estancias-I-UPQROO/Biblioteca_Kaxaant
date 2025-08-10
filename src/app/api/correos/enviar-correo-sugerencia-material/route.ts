// src/app/api/correos/enviar-correo-sugerencia-material/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendMail';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { matricula, titulo, autor_editorial, tema, anio_publicacion } = await req.json();

    const contenido = `
      Estimada encargada de biblioteca,

      Se ha recibido una nueva sugerencia de material bibliográfico:

          🆔 Matrícula: ${matricula}
          📖 Título sugerido: ${titulo}
          ✍️ Autor / Editorial: ${autor_editorial}
          🏷️ Tema: ${tema}
          📅 Año de publicación: ${anio_publicacion}

      Esta sugerencia fue enviada para enriquecer el acervo bibliográfico institucional.

      Si acepta la sugerencia, favor de mandar un correo a ${matricula}@upqroo.edu.mx de la confirmación de esta misma

      Saludos cordiales,  
      Sistema de Biblioteca
    `;

    await sendEmail({
      matricula,
      asunto: '📚 Sugerencia de compra bibliográfica',
      contenido,
    });

    return NextResponse.json(
      { message: "Correo de sugerencia enviado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al enviar correo" },
      { status: 500 }
    );
  }
}