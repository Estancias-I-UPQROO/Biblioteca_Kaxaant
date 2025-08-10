import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuración de directorios
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const UPLOAD_TYPES = {
  sliders: path.join(UPLOADS_DIR, 'sliders'),
  recursos: path.join(UPLOADS_DIR, 'recursos'),
  eventos: path.join(UPLOADS_DIR, 'eventos')
};

// Crear directorios si no existen
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    for (const dir of Object.values(UPLOAD_TYPES)) {
      await fs.mkdir(dir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creando directorios de uploads:', error);
  }
}

// Procesar form-data para diferentes tipos de upload (ahora recibe FormData)
export async function handleFileUpload(
  formData: FormData,
  fieldName: string,
  uploadType: keyof typeof UPLOAD_TYPES
) {
  await ensureUploadsDir();

  const file = formData.get(fieldName) as File | null;

  if (!file || file.size === 0) return null;

  // Validar tipo de imagen
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido');
  }

  // Generar nombre único para el archivo
  const ext = path.extname(file.name);
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(UPLOAD_TYPES[uploadType], filename);
  const publicUrl = `/uploads/${uploadType}/${filename}`;

  // Convertir File a buffer y guardar
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  return publicUrl;
}

// Resto de las funciones permanecen igual...
export async function deleteFile(
  fileUrl: string,
  uploadType: keyof typeof UPLOAD_TYPES
) {
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(UPLOAD_TYPES[uploadType], filename);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    throw error;
  }
}

export async function getFileBuffer(
  fileUrl: string,
  uploadType: keyof typeof UPLOAD_TYPES
) {
  const filename = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_TYPES[uploadType], filename);
  return fs.readFile(filePath);
}