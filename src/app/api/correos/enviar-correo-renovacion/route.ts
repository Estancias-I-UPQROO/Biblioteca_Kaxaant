// src/app/api/correos/enviar-correo-renovacion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendMail';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { matricula, nombre_libro } = await req.json();

    if (!matricula || !Array.isArray(nombre_libro) || nombre_libro.length === 0) {
      return NextResponse.json(
        { message: "Datos incompletos" },
        { status: 400 }
      );
    }

    const librosLista = nombre_libro
      .map((libro: string, index: number) => `    📖 Libro ${index + 1}: ${libro}`)
      .join('\n');

    const contenido = `
      Estimada encargada de biblioteca,

      Se informa que el estudiante con matrícula ${matricula} ha renovado su(s) préstamo(s):

      ${librosLista}

      La renovación esta pendiente, mandar correo ${matricula}@upqroo.edu.mx la confirmación y el día máximo a devolver

      Saludos cordiales,  
      Sistema de Biblioteca
    `;

    await sendEmail({
      matricula,
      asunto: '📌 Renovación de préstamo',
      contenido,
    });

    return NextResponse.json(
      { message: "Correo de renovación enviado correctamente" },
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