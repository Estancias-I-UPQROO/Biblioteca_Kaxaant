import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { Admin } from '@/models/Admin.model';


export const optionalVerifyJWT = async (req: NextRequest) => {
    const bearer = req.headers.get('authorization');

    if (!bearer) return null;

    const token = bearer.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY!);

        if (typeof decoded === 'object' && decoded.ID_Admin) {
            const admin = await Admin.findByPk(decoded.ID_Admin, {
                attributes: ["ID_Admin"],
            });

            if (admin) return admin;
        }
    } catch {
        // Ignorar errores
    }

    return null;
};