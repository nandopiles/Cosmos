/**
 * Servicio de envío del formulario de contacto.
 *
 * Usa un endpoint externo (Formspree por defecto) para reenviar el mensaje al
 * correo del destinatario, sin necesidad de backend propio. El endpoint se
 * inyecta por variable de entorno (VITE_CONTACT_ENDPOINT) para no hardcodear
 * el ID en el repositorio y poder cambiarlo sin tocar código.
 *
 * El correo destino NO vive en el frontend: se configura en el panel de
 * Formspree, evitando exponerlo a scrapers de spam.
 */

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

export interface ContactPayload {
  email: string;
  message: string;
}

export type SendResult =
  | { ok: true }
  | { ok: false; error: string };

/** ¿Está configurado el endpoint de envío? */
export function isContactConfigured(): boolean {
  return Boolean(ENDPOINT);
}

/**
 * Envía el mensaje de contacto. Devuelve un resultado tipado en vez de lanzar,
 * para que la UI decida cómo mostrar el error.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<SendResult> {
  if (!ENDPOINT) {
    return { ok: false, error: 'Endpoint de contacto no configurado (VITE_CONTACT_ENDPOINT).' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        message: payload.message,
        // Asunto legible en la bandeja del destinatario.
        _subject: `Nuevo mensaje del portfolio · ${payload.email}`,
      }),
    });

    if (res.ok) return { ok: true };

    // Formspree devuelve detalles del error en JSON.
    const data = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
    const detail = data?.errors?.map((e) => e.message).join(', ');
    return { ok: false, error: detail || `Error del servidor (${res.status}).` };
  } catch {
    return { ok: false, error: 'No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.' };
  }
}
