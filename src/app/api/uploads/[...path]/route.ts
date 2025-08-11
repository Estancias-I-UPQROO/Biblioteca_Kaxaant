import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { path: string[] } }
) {
    const filePath = path.join(
        process.cwd(),
        'uploads',
        ...params.path
    );

    try {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();

        let contentType = 'application/octet-stream';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.webp') contentType = 'image/webp';

        // Solución definitiva - Convertir Buffer a Uint8Array primero
        const uint8Array = new Uint8Array(fileBuffer);
        const blob = new Blob([uint8Array], { type: contentType });
        
        return new NextResponse(blob, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 404 }
        );
    }
}