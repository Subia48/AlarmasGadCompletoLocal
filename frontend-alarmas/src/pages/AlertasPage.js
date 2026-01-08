import React, { useState, useEffect } from "react";
import {
  obtenerAlertas,
  atenderAlerta,
} from "../api/alertas";
import { obtenerAlarmas } from "../api/alarmas";
import { obtenerUsuarios } from "../api/usuarios";
import { obtenerCodigosEmergencia } from "../api/emergencyCodes";
import Mapa from "../components/Mapa";
import GenerarSosManual from "../components/GenerarSosManual";
import { useAuth } from "../context/AuthContext";

export default function AlertasPage() {
  const { user } = useAuth();

  const [alertas, setAlertas] = useState([]);
  const [alarmas, setAlarmas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [codigosEmergencia, setCodigosEmergencia] = useState([]);

  // selección por alerta
  const [seleccionEmergencia, setSeleccionEmergencia] = useState({});

  // ===============================
  // CARGAR DATOS
  // ===============================
  const cargarDatos = async () => {
    try {
      const alertasData = await obtenerAlertas();
      setAlertas(alertasData);

      const alarmasData = await obtenerAlarmas();
      setAlarmas(alarmasData);

      if (user?.rol === "admin") {
        const usuariosData = await obtenerUsuarios();
        setUsuarios(usuariosData);
      } else {
        setUsuarios([]);
      }

      const codigosData = await obtenerCodigosEmergencia();
      setCodigosEmergencia(codigosData);
    } catch (err) {
      console.error("Error cargando alertas:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 3000);
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // MARCAR ATENDIDA
  // ===============================
  const marcarAtendida = async (alertaId) => {
    const seleccion = seleccionEmergencia[alertaId];

    if (!seleccion) {
      alert("Seleccione un tipo de emergencia");
      return;
    }

    try {
      await atenderAlerta(
        alertaId,
        seleccion.codigo,
        seleccion.descripcion
      );

      setSeleccionEmergencia((prev) => {
        const copia = { ...prev };
        delete copia[alertaId];
        return copia;
      });

      await cargarDatos();
    } catch (err) {
      alert(err.message);
    }
  };

  // ===============================
  // UTILIDADES
  // ===============================
  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? usuario.nombre : usuarioId;
  };

  // 👉 LISTA: TODAS
  const alertasParaLista = alertas;

  // 👉 MAPA: SOLO NO ATENDIDAS
  const alertasParaMapa = alertas.filter(
    (a) => a.estado !== "atendida"
  );

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="container">
      <div>
        <h2>Alertas</h2>

        <ul className="scrollable-list">
          {alertasParaLista.map((a) => (
            <li key={a.id} style={{ marginBottom: "1rem" }}>
              <strong>Usuario:</strong>{" "}
              {obtenerNombreUsuario(a.usuarioId)}
              <br />

              <strong>Ubicación:</strong>{" "}
              {a.ubicacion?.lat}, {a.ubicacion?.lng}
              <br />

              <strong>Alarma vinculada:</strong> {a.alarmaId}
              <br />

              <strong>Estado:</strong> {a.estado}
              <br />

              <strong>Fecha:</strong>{" "}
              {a.timestamp
                ? new Date(a.timestamp).toLocaleString()
                : "Sin fecha"}
              <br />

              {a.estado !== "atendida" && (
                <>
                  <select
                    value={seleccionEmergencia[a.id]?.codigo || ""}
                    onChange={(e) => {
                      const seleccionado = codigosEmergencia.find(
                        (c) => c.codigo === e.target.value
                      );
                      setSeleccionEmergencia((prev) => ({
                        ...prev,
                        [a.id]: seleccionado,
                      }));
                    }}
                  >
                    <option value="">Seleccione tipo de emergencia</option>
                    {codigosEmergencia.map((c) => (
                      <option key={c.id} value={c.codigo}>
                        {c.codigo} - {c.descripcion}
                      </option>
                    ))}
                  </select>

                  <br />

                  <button
                    style={{ marginTop: "0.5rem" }}
                    onClick={() => marcarAtendida(a.id)}
                  >
                    Marcar como atendida
                  </button>
                </>
              )}

              {a.estado === "atendida" && (
                <p style={{ color: "green" }}>
                  ✔ Atendida ({a.tipoEmergencia})
                </p>
              )}
            </li>
          ))}
        </ul>

        <div className="generadorContainer">
          <GenerarSosManual usuario={user} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateRows: "auto 1fr" }}>
        <h3>Mapa de alertas</h3>
        <Mapa
          alertas={alertasParaMapa}
          alarmas={alarmas}
          usuarios={usuarios}
        />
      </div>
    </div>
  );
}
