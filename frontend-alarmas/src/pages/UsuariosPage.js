import React, { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  actualizarRol,
  eliminarUsuarioCompletamente,
  crearUsuario,
} from "../api/usuarios";
import { useAuth } from "../context/AuthContext";

/**
 * ROLES DEL SISTEMA
 */
const ROLES = [
  { value: "usuario", label: "Usuario" },
  { value: "cuerpo_sos", label: "Cuerpo SOS" },
  { value: "operador_alertas", label: "Operador de Alertas" },
  { value: "gestor_usuarios", label: "Gestor de Usuarios" },
  { value: "gestor_codigos", label: "Gestor de Códigos" },
  { value: "operador_sos", label: "Operador SOS" },
  { value: "gestor_alarmas", label: "Gestor de Alarmas" },
  { value: "admin", label: "Admin" }, // 👑 solo visible para admin
];

export default function UsuariosPage() {
  const { user } = useAuth();
  const miRol = user.rol;

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
    } catch {
      setError("Error cargando usuarios");
    }
  };

  const handleActualizarRol = async (id, rol) => {
    try {
      await actualizarRol(id, rol);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error actualizando rol");
    }
  };

  const handleEliminar = async (u) => {
    if (
      miRol === "gestor_usuarios" &&
      u.rol === "admin"
    ) {
      alert("No puedes eliminar un administrador");
      return;
    }

    if (!window.confirm("¿Eliminar este usuario?")) return;

    try {
      await eliminarUsuarioCompletamente(u.id);
      cargarUsuarios();
    } catch {
      setError("Error eliminando usuario");
    }
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setError("");

    if (!nuevoUsuario.cedula || !nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (miRol === "gestor_usuarios" && nuevoUsuario.rol === "admin") {
      setError("No puedes crear administradores");
      return;
    }

    try {
      await crearUsuario(nuevoUsuario);
      setMostrarModal(false);
      setNuevoUsuario({
        cedula: "",
        nombre: "",
        email: "",
        password: "",
        rol: "usuario",
      });
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error creando usuario");
    }
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

      <div className="grid-cards">
        {usuariosFiltrados.map((u) => {
          const adminProtegido =
            miRol === "gestor_usuarios" && u.rol === "admin";

          return (
            <div key={u.id} className="card">
              <p><b>Cédula:</b> {u.cedula}</p>
              <p><b>Nombre:</b> {u.nombre}</p>
              <p><b>Email:</b> {u.email}</p>

              <label>Rol:</label>
              <select
                className="input"
                value={u.rol}
                disabled={adminProtegido}
                onChange={(e) =>
                  handleActualizarRol(u.id, e.target.value)
                }
              >
                {ROLES.filter(
                  (r) => miRol === "admin" || r.value !== "admin"
                ).map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-danger full-width"
                disabled={adminProtegido}
                onClick={() => handleEliminar(u)}
              >
                🗑 Eliminar
              </button>

              {adminProtegido && (
                <small className="text-muted">
                  Usuario administrador protegido
                </small>
              )}
            </div>
          );
        })}
      </div>

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Nuevo Usuario</h3>

            <form onSubmit={handleCrearUsuario} className="form-column">
              <input className="input" placeholder="Cédula"
                value={nuevoUsuario.cedula}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, cedula: e.target.value })}
              />
              <input className="input" placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              />
              <input className="input" placeholder="Email" type="email"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
              />
              <input className="input" placeholder="Contraseña" type="password"
                value={nuevoUsuario.password}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              />

              <select
                className="input"
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
              >
                {ROLES.filter(
                  (r) => miRol === "admin" || r.value !== "admin"
                ).map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
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
