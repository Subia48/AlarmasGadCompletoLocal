// src/pages/UsuariosPage.js
import React, { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  actualizarRol,
  eliminarUsuarioCompletamente,
  crearUsuario,
} from "../api/usuarios";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    cedula: "",
    nombre: "",
    email: "",
    password: "",
    rol: "usuario",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const lista = await obtenerUsuarios();
      setUsuarios(lista);
    } catch (err) {
      setError(err.message || "Error cargando usuarios");
    }
  };

  const handleActualizarRol = async (id, rol) => {
    await actualizarRol(id, rol);
    cargarUsuarios();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await eliminarUsuarioCompletamente(id);
    cargarUsuarios();
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setError("");

    if (!nuevoUsuario.cedula || !nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    await crearUsuario(nuevoUsuario);
    setNuevoUsuario({
      cedula: "",
      nombre: "",
      email: "",
      password: "",
      rol: "usuario",
    });
    setMostrarModal(false);
    cargarUsuarios();
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula?.includes(busqueda)
  );

  return (
    <div className="container-mobile">
      <h2 className="titulo">Gestión de Usuarios</h2>

      {error && <div className="alert-error">{error}</div>}

      <button className="btn btn-success full-width" onClick={() => setMostrarModal(true)}>
        ➕ Crear usuario
      </button>

      <input
        className="input"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* LISTA RESPONSIVE */}
      <div className="grid-cards">
        {usuariosFiltrados.map((u) => (
          <div key={u.id} className="card">
            <p><b>Cédula:</b> {u.cedula}</p>
            <p><b>Nombre:</b> {u.nombre}</p>
            <p><b>Email:</b> {u.email}</p>

            <label>Rol:</label>
            <select
              className="input"
              value={u.rol}
              onChange={(e) => handleActualizarRol(u.id, e.target.value)}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
              <option value="cuerpo_sos">Cuerpo SOS</option>
            </select>

            <button
              className="btn btn-danger full-width"
              onClick={() => handleEliminar(u.id)}
            >
              🗑 Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Nuevo Usuario</h3>

            <form onSubmit={handleCrearUsuario} className="form-column">
              <input
                className="input"
                placeholder="Cédula"
                value={nuevoUsuario.cedula}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, cedula: e.target.value })}
              />
              <input
                className="input"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              />
              <input
                className="input"
                placeholder="Email"
                type="email"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
              />
              <input
                className="input"
                placeholder="Contraseña"
                type="password"
                value={nuevoUsuario.password}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              />

              <select
                className="input"
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
                <option value="cuerpo_sos">Cuerpo SOS</option>
              </select>

              <div className="row">
                <button className="btn btn-success" type="submit">Guardar</button>
                <button className="btn btn-cancel" type="button" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
