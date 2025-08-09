import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Admin } from '@/models/Admin.model';

export const verifyJWT = async (req: NextRequest) => {
    const bearer = req.headers.get('authorization');

    if (!bearer) {
        return NextResponse.json(
            { message: 'No estás autorizado para realizar esta acción' },
            { status: 401 }
        );
    }

    const token = bearer.split(' ')[1];

    if (!token) {
        return NextResponse.json(
            { message: 'No estás autorizado para realizar esta acción' },
            { status: 401 }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY!);
        
        if (typeof decoded === 'object' && decoded.ID_Admin) {
            const admin = await Admin.findByPk(decoded.ID_Admin, {
                attributes: ['ID_Admin']
            });

            if (!admin) {
                return NextResponse.json(
                    { message: 'No estás autorizado para realizar esta acción' },
                    { status: 401 }
                );
            }

            return admin;
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'No estás autorizado para realizar esta acción' },
            { status: 401 }
        );
    }
};