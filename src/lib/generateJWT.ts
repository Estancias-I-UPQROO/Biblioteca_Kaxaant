import jwt from 'jsonwebtoken';

type PayloadData = {
    ID_Admin: string;
};

export const generateJWT = (payload: PayloadData): string => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY no está definida en las variables de entorno');
    }

    const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '7d'
    });

    return token;
};