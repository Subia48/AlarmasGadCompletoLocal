// src/api/client.js
export const API_URL = process.env.REACT_APP_API_URL || "/api";

/**
 * Wrapper de fetch que:
 * - añade automáticamente Content-Type: application/json
 * - añade el token JWT si existe en localStorage
 * - parsea el JSON y lanza error si la respuesta no es ok
 */
export async function apiFetch(
  path,
  { method = "GET", body, headers, ...options } = {}
) {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!res.ok) {
    let message = `Error en la API (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignorar error de parseo
    }
    throw new Error(message);
  }

  // Si no hay contenido
  if (res.status === 204) return null;

  return res.json();
}
