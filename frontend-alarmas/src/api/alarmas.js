// src/api/alarmas.js
import { apiFetch } from "./client";

// Obtener todas las alarmas
export async function obtenerAlarmas() {
  return apiFetch("/alarms");
}

// Crear una nueva alarma
export async function crearAlarma(data) {
  return apiFetch("/alarms", {
    method: "POST",
    body: {
      // AQUÍ ya no copiamos direccion al nombre
      nombre: data.nombre ?? "",          // puede ir vacío
      direccion: data.direccion,          // obligatorio
      lat: data.lat,                      // ya vienen como número desde AlarmasPage
      lng: data.lng,
      deviceId: data.deviceId,
    },
  });
}

// Editar una alarma
export async function editarAlarma(id, data) {
  const body = { ...data };

  if (body.lat !== undefined) {
    body.lat = typeof body.lat === "string" ? parseFloat(body.lat) : body.lat;
  }
  if (body.lng !== undefined) {
    body.lng = typeof body.lng === "string" ? parseFloat(body.lng) : body.lng;
  }

  return apiFetch(`/alarms/${id}`, {
    method: "PUT",
    body,
  });
}

// Eliminar
export async function eliminarAlarma(id) {
  return apiFetch(`/alarms/${id}`, {
    method: "DELETE",
  });
}

// Probar
export async function probarAlarma(id) {
  return apiFetch(`/alarms/${id}/probar`, {
    method: "POST",
  });
}
