// src/pages/CodigosEmergenciaPage.js
import React, { useEffect, useState } from "react";
import {
  obtenerCodigosEmergencia,
  crearCodigoEmergencia,
  actualizarCodigoEmergencia,
  eliminarCodigoEmergencia,
} from "../api/emergencyCodes";

export default function CodigosEmergenciaPage() {
  const [codigos, setCodigos] = useState([]);

  // formulario
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // edición
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  const cargarCodigos = async () => {
    try {
      const data = await obtenerCodigosEmergencia();
      setCodigos(data);
    } catch (err) {
      setError("Error cargando códigos");
    }
  };

  useEffect(() => {
    cargarCodigos();
  }, []);

  const guardarCodigo = async (e) => {
    e.preventDefault();
    setError("");

    if (!codigo || !descripcion) {
      setError("Complete todos los campos");
      return;
    }

    if (editandoId) {
      await actualizarCodigoEmergencia(editandoId, {
        codigo,
        descripcion,
      });
    } else {
      await crearCodigoEmergencia({ codigo, descripcion });
    }

    setCodigo("");
    setDescripcion("");
    setEditandoId(null);
    cargarCodigos();
  };

  const editarCodigo = (c) => {
    setCodigo(c.codigo);
    setDescripcion(c.descripcion);
    setEditandoId(c.id);
  };

  const cancelarEdicion = () => {
    setCodigo("");
    setDescripcion("");
    setEditandoId(null);
  };

  const borrarCodigo = async (id) => {
    if (!window.confirm("¿Eliminar este código?")) return;
    await eliminarCodigoEmergencia(id);
    cargarCodigos();
  };

  return (
    <div className="container-mobile">
      <h2 className="titulo">Códigos de Emergencia</h2>

      {error && <div className="alert-error">{error}</div>}

      {/* FORMULARIO */}
      <div className="card">
        <h3>{editandoId ? "Editar código" : "Nuevo código"}</h3>

        <form onSubmit={guardarCodigo} className="form-column">
          <input
            className="input"
            placeholder="Código (ej: CODIGO_BLANCO)"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          />

          <input
            className="input"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <div className="row">
            <button className="btn btn-success" type="submit">
              {editandoId ? "Actualizar" : "Guardar"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn btn-cancel"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA */}
      <div className="grid-cards">
        {codigos.map((c) => (
          <div key={c.id} className="card">
            <p>
              <b>Código:</b> {c.codigo}
            </p>
            <p>
              <b>Descripción:</b> {c.descripcion}
            </p>

            <div className="row">
              <button
                className="btn btn-warning"
                onClick={() => editarCodigo(c)}
              >
                ✏️ Editar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => borrarCodigo(c.id)}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
