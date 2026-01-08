import React, { useEffect, useState } from "react";
import {
  obtenerAlarmas,
  crearAlarma,
  editarAlarma,
  eliminarAlarma,
  probarAlarma,
} from "../api/alarmas";
import Mapa from "../components/Mapa";

export default function AlarmasPage() {
  const [alarmas, setAlarmas] = useState([]);
  const [mostrandoModal, setMostrandoModal] = useState(false);
  const [error, setError] = useState("");

  // estados para crear / editar
  const [nuevaAlarma, setNuevaAlarma] = useState({
    direccion: "",
    lat: "",
    lng: "",
    deviceId: "",
    nombre: "",
  });

  const [editando, setEditando] = useState(false);
  const [alarmaEditandoId, setAlarmaEditandoId] = useState(null);

  useEffect(() => {
    cargarAlarmas();
  }, []);

  const cargarAlarmas = async () => {
    try {
      const datos = await obtenerAlarmas();
      setAlarmas(datos);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error cargando alarmas");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaAlarma((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !nuevaAlarma.direccion ||
      !nuevaAlarma.lat ||
      !nuevaAlarma.lng ||
      !nuevaAlarma.deviceId
    ) {
      setError(
        "Todos los campos son obligatorios (dirección, lat, lng, deviceId)"
      );
      return;
    }

    try {
      const payload = {
        nombre: nuevaAlarma.nombre || nuevaAlarma.direccion,
        direccion: nuevaAlarma.direccion,
        lat: parseFloat(nuevaAlarma.lat),
        lng: parseFloat(nuevaAlarma.lng),
        deviceId: nuevaAlarma.deviceId,
      };

      if (editando) {
        // ✏️ EDITAR
        await editarAlarma(alarmaEditandoId, payload);
      } else {
        // ➕ CREAR
        await crearAlarma(payload);
      }

      // limpiar estados
      setNuevaAlarma({
        direccion: "",
        lat: "",
        lng: "",
        deviceId: "",
        nombre: "",
      });
      setEditando(false);
      setAlarmaEditandoId(null);
      setMostrandoModal(false);
      await cargarAlarmas();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error guardando alarma");
    }
  };

  const handleEditar = (alarma) => {
    setNuevaAlarma({
      nombre: alarma.nombre || "",
      direccion: alarma.direccion,
      lat: alarma.lat,
      lng: alarma.lng,
      deviceId: alarma.deviceId,
    });
    setAlarmaEditandoId(alarma.id);
    setEditando(true);
    setMostrandoModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta alarma?")) return;
    try {
      await eliminarAlarma(id);
      await cargarAlarmas();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error eliminando alarma");
    }
  };

  const handleProbar = async (id) => {
    try {
      await probarAlarma(id);
      alert("Prueba de alarma enviada (simulada)");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error probando alarma");
    }
  };

  return (
    <div className="container">
      {/* COLUMNA IZQUIERDA */}
      <div style={{ padding: "1.5rem" }}>
        <h2>Gestión de Alarmas</h2>

        {error && (
          <div
            style={{
              background: "#ffdddd",
              color: "#b00",
              padding: "0.5rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <strong>ERROR</strong> {error}
          </div>
        )}

        <button
  className="btn btn-crear"
  onClick={() => {
    setEditando(false);
    setAlarmaEditandoId(null);
    setNuevaAlarma({
      direccion: "",
      lat: "",
      lng: "",
      deviceId: "",
      nombre: "",
    });
    setMostrandoModal(true);
  }}
>
   Crear nueva alarma
</button>


        {/* MODAL CREAR / EDITAR */}
        {mostrandoModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                minWidth: "320px",
                maxWidth: "500px",
              }}
            >
              <h3>{editando ? "Editar Alarma" : "Nueva Alarma"}</h3>

              <form
                onSubmit={handleGuardar}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre (opcional)"
                  value={nuevaAlarma.nombre}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección de referencia"
                  value={nuevaAlarma.direccion}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  step="any"
                  name="lat"
                  placeholder="Latitud"
                  value={nuevaAlarma.lat}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  step="any"
                  name="lng"
                  placeholder="Longitud"
                  value={nuevaAlarma.lng}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="deviceId"
                  placeholder="ID del dispositivo"
                  value={nuevaAlarma.deviceId}
                  onChange={handleChange}
                  required
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button className="btn btn-crear" type="submit">
  {editando ? "Guardar cambios" : "Crear"}
</button>
<button
  className="btn btn-cancelar"
  type="button"
  onClick={() => setMostrandoModal(false)}
>
  Cancelar
</button>

                </div>
              </form>
            </div>
          </div>
        )}

        {/* LISTA DE ALARMAS */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {alarmas.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                minWidth: "260px",
              }}
            >
              <p><strong>ID:</strong> {a.id}</p>
              <p><strong>Nombre:</strong> {a.nombre || "(sin nombre)"}</p>
              <p><strong>Dirección:</strong> {a.direccion}</p>
              <p><strong>Ubicación:</strong> ({a.lat}, {a.lng})</p>
              <p><strong>Estado:</strong> {a.estado}</p>
              <p><strong>Device ID:</strong> {a.deviceId}</p>

             <div className="acciones-alarma">
  <button
    className="btn btn-probar"
    onClick={() => handleProbar(a.id)}
  >
     Probar
  </button>

  <button
    className="btn btn-editar"
    onClick={() => handleEditar(a)}
  >
     Editar
  </button>

  <button
    className="btn btn-eliminar"
    onClick={() => handleEliminar(a.id)}
  >
     Eliminar
  </button>
</div>

            </div>
          ))}
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
        <h3>Mapa de Alarmas</h3>
        <Mapa alarmas={alarmas} />
      </div>
    </div>
  );
}
