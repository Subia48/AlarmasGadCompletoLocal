import { apiFetch } from "./client";

// LISTAR códigos
export const obtenerCodigosEmergencia = () =>
  apiFetch("/emergency-codes");

// CREAR código
export const crearCodigoEmergencia = (data) =>
  apiFetch("/emergency-codes", {
    method: "POST",
    body: data,
  });

// ✅ ACTUALIZAR código (ESTO FALTABA)
export const actualizarCodigoEmergencia = (id, data) =>
  apiFetch(`/emergency-codes/${id}`, {
    method: "PUT",
    body: data,
  });

// ELIMINAR código
export const eliminarCodigoEmergencia = (id) =>
  apiFetch(`/emergency-codes/${id}`, {
    method: "DELETE",
  });
