import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest } from 'next/server';

// Configuración de directorios (ajusta según tu estructura)
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const SLIDERS_DIR = path.join(UPLOADS_DIR, 'sliders');

// Crear directorios si no existen
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(SLIDERS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creando directorios de uploads:', error);
  }
}

// Procesar form-data (Next.js 13+)
export async function handleFileUpload(req: NextRequest, fieldName: string) {
  await ensureUploadsDir();
  
  const formData = await req.formData();
  const file = formData.get(fieldName) as File | null;

  if (!file) return null;

  // Generar nombre único para el archivo
  const ext = path.extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(SLIDERS_DIR, filename);
  const publicUrl = `/uploads/sliders/${filename}`;

  // Convertir File a buffer y guardar
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  return publicUrl;
}

// Eliminar archivo
export async function deleteFile(fileUrl: string) {
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(SLIDERS_DIR, filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error eliminando archivo:', error);
  }
}