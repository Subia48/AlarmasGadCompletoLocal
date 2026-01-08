import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditarContactoPage from "./EditarContactoPage";
import { apiFetch } from "../api/client";
import Mapa from "../components/Mapa";

export default function UsuarioHomePage() {
  const { user, logout } = useAuth();
  const [ubicacion, setUbicacion] = useState(null);
  const [editandoContacto, setEditandoContacto] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCargandoUbicacion(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCargandoUbicacion(false);
      },
      () => setCargandoUbicacion(false)
    );
  }, []);

  const enviarSOS = async () => {
    if (!ubicacion) {
      alert("No se pudo obtener la ubicación");
      return;
    }

    try {
      await apiFetch("/alerts", {
        method: "POST",
        body: {
          lat: ubicacion.lat,
          lng: ubicacion.lng,
        },
      });

      alert("🚨 SOS enviado. La alarma más cercana fue activada.");
    } catch (err) {
      alert("Error enviando SOS: " + err.message);
    }
  };

  if (editandoContacto) {
    return <EditarContactoPage onVolver={() => setEditandoContacto(false)} />;
  }

  const alertaUsuario = ubicacion
    ? [
        {
          id: "mi-ubicacion",
          usuarioId: user.id,
          estado: "pendiente",
          ubicacion: {
            lat: ubicacion.lat,
            lng: ubicacion.lng,
          },
        },
      ]
    : [];

  return (
    <div className="usuario-home">
      <h2 className="usuario-home-title">
        Bienvenido, {user.nombre}
      </h2>

      {/* MAPA */}
      <div className="usuario-mapa-wrapper">
        {cargandoUbicacion ? (
          <p>📍 Obteniendo ubicación...</p>
        ) : ubicacion ? (
          <div className="usuario-mapa">
            <Mapa alertas={alertaUsuario} />
          </div>
        ) : (
          <p>No se pudo obtener la ubicación</p>
        )}
      </div>

      {/* BOTONES */}
      <div className="usuario-botones">
        <button className="btn btn-danger" onClick={enviarSOS}>
          🚨 Enviar SOS
        </button>

        <button
          className="btn btn-warning"
          onClick={() => setEditandoContacto(true)}
        >
          ✏️ Editar contacto de emergencia
        </button>

        
      </div>
    </div>
  );
}
