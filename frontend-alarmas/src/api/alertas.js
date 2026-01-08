// src/api/alertas.js
import { apiFetch } from "./client";

/**
 * ============================================
 * LISTAR ALERTAS (ADMIN / CUERPO SOS)
 * ============================================
 */
export async function obtenerAlertas(estado) {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : "";
  return apiFetch(`/admin/alerts${query}`);
}

/**
 * ============================================
 * ATENDER ALERTA (ADMIN / CUERPO SOS)
 * Guarda tipo y descripción de emergencia
 * ============================================
 */
export const atenderAlerta = (id, tipoEmergencia, descripcionEmergencia) =>
  apiFetch(`/admin/alerts/${id}/atender`, {
    method: "PUT",
    body: { tipoEmergencia, descripcionEmergencia },
  });

/**
 * ============================================
 * CAMBIO DE ESTADO SIMPLE (OPCIONAL)
 * ============================================
 */
export async function actualizarEstadoAlerta(id, estado) {
  return apiFetch(`/admin/alerts/${id}`, {
    method: "PUT",
    body: { estado },
  });
}

/**
 * ============================================
 * ENVIAR SOS DESDE WEB / USUARIO
 * ============================================
 */
export async function enviarSos(uid, lat, lng) {
  return apiFetch("/alerts", {
    method: "POST",
    body: {
      lat,
      lng,
    },
  });
}
