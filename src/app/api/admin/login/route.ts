import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Admin } from '@/models/Admin.model';
import { generateJWT } from '@/lib/generateJWT';
import { connectDB } from '@/lib/db';

// Esquema de validación con Zod
const loginSchema = z.object({
    Usuario: z.string().min(1, "El usuario es requerido"),
    Password: z.string().min(1, "La contraseña es requerida")
});

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        
        // Validar el cuerpo de la solicitud
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { message: 'Datos inválidos', errors: validation.error },
                { status: 400 }
            );
        }

        const { Usuario, Password } = validation.data;

        // Buscar el administrador
        const admin = await Admin.findOne({ where: { Usuario } });
        if (!admin) {
            return NextResponse.json(
                { message: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(Password, admin.Password);
        if (!passwordMatch) {
            return NextResponse.json(
                { message: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Generar token JWT
        const token = generateJWT({ ID_Admin: admin.ID_Admin });

        return NextResponse.json({ token }, { status: 200 });

    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}