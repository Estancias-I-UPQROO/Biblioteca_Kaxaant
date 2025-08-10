// src/lib/sendMail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

type EmailProps = {
  matricula: string;
  asunto: string;
  contenido: string;
};

export const sendEmail = async ({ matricula, asunto, contenido }: EmailProps) => {
  try {
    const { error } = await resend.emails.send({
      from: `${matricula}@resend.dev`,
      to: 'bluevelociraptor1555@gmail.com',
      subject: asunto,
      text: contenido,
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      throw new Error(error.message);
    }
    return { success: true };
  } catch (err) {
    console.error('Excepción al enviar correo:', err);
    throw err;
  }
};