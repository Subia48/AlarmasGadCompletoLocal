// src/api/usuarios.js
import { apiFetch } from "./client";

export async function obtenerUsuarios() {
  return apiFetch("/users");
}

export async function crearUsuario(data) {
  // data: { nombre, email, password, rol }
  return apiFetch("/users", {
    method: "POST",
    body: data,
  });
}

export async function actualizarRol(id, nuevoRol) {
  return apiFetch(`/users/${id}/role`, {
    method: "PUT",
    body: { rol: nuevoRol },
  });
}

export async function eliminarUsuarioCompletamente(id) {
  return apiFetch(`/users/${id}/completo`, {
    method: "DELETE",
  });
}
