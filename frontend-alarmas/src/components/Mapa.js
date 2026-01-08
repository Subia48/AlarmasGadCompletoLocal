// src/components/Mapa.js
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Centro por defecto (Cayambe aprox.)
const CENTRO_DEFECTO = [-0.045, -78.14];
const ZOOM_DEFECTO = 14;

// Componente auxiliar para ajustar el mapa a los puntos
function AjustarMapa({ puntos, centroManual, zoomManual }) {
  const map = useMap();

  useEffect(() => {
    // Si se pidió centrar manualmente (click en marcador)
    if (centroManual) {
      map.setView(centroManual, zoomManual ?? 17);
      return;
    }

    // Si hay puntos (alarmas/alertas), hacemos fitBounds
    if (puntos.length > 0) {
      const bounds = L.latLngBounds(
        puntos.map(([lat, lng]) => L.latLng(lat, lng))
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      // Si no hay puntos, centro por defecto
      map.setView(CENTRO_DEFECTO, ZOOM_DEFECTO);
    }
  }, [puntos, centroManual, zoomManual, map]);

  return null;
}

export default function Mapa({
  alarmas = [],
  alertas = [],
  usuarios = [],
}) {
  const [centroManual, setCentroManual] = useState(null);
  const [zoomManual, setZoomManual] = useState(null);

  // Puntos de alarmas y alertas
  const puntosAlarmas = useMemo(
    () =>
      alarmas
        .filter((a) => a.lat != null && a.lng != null)
        .map((a) => [a.lat, a.lng]),
    [alarmas]
  );

  const puntosAlertas = useMemo(
    () =>
      alertas
        .filter((a) => a.ubicacion && a.ubicacion.lat && a.ubicacion.lng)
        .map((a) => [a.ubicacion.lat, a.ubicacion.lng]),
    [alertas]
  );

  const puntosTotales = useMemo(
    () => [...puntosAlarmas, ...puntosAlertas],
    [puntosAlarmas, puntosAlertas]
  );

  // Iconos
  const iconAlarma = new L.Icon({
    iconUrl: "alarma-icon.png",
    iconSize: [30, 30],
  });

  const iconAlerta = new L.Icon({
    iconUrl: "alertas.gif",
    iconSize: [40, 40],
  });
  const iconUsuario = new L.Icon({
  iconUrl: "usuario-icon.png",
  iconSize: [35, 35],
});


  const handleMarkerClick = (lat, lng) => {
    setCentroManual([lat, lng]);
    setZoomManual(17);
  };

  // Buscar nombre de usuario para las alertas
  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? usuario.nombre : usuarioId;
  };

  return (
    <MapContainer
      center={CENTRO_DEFECTO}
      zoom={ZOOM_DEFECTO}
      style={{ height: "100%", minHeight: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de alarmas */}
      {alarmas.map(
        (a) =>
          a.lat != null &&
          a.lng != null && (
            <Marker
              key={a.id}
              position={[a.lat, a.lng]}
              icon={iconAlarma}
              eventHandlers={{
                click: () => handleMarkerClick(a.lat, a.lng),
              }}
            >
              <Popup>
                <strong>Alarma:</strong> {a.nombre || a.direccion}
                <br />
                <strong>Dirección:</strong> {a.direccion}
                <br />
                <strong>Estado:</strong> {a.estado}
              </Popup>
            </Marker>
          )
      )}

      {/* Marcadores de alertas */}
{alertas.map(
  (a) =>
    a.ubicacion &&
    a.ubicacion.lat &&
    a.ubicacion.lng && (
      <Marker
        key={a.id}
        position={[a.ubicacion.lat, a.ubicacion.lng]}
        icon={a.id === "mi-ubicacion" ? iconUsuario : iconAlerta}
        eventHandlers={{
          click: () =>
            handleMarkerClick(a.ubicacion.lat, a.ubicacion.lng),
        }}
      >
        <Popup>
          {a.id === "mi-ubicacion" ? (
            <>
              <strong>📍 Tu ubicación</strong>
              <br />
              {a.ubicacion.lat}, {a.ubicacion.lng}
            </>
          ) : (
            <>
              <strong>🚨 Alerta:</strong>{" "}
              {obtenerNombreUsuario(a.usuarioId)}
              <br />
              Estado: {a.estado}
            </>
          )}
        </Popup>
      </Marker>
    )
)}


      {/* Componente que ajusta el mapa según puntos o click */}
      <AjustarMapa
        puntos={puntosTotales}
        centroManual={centroManual}
        zoomManual={zoomManual}
      />
    </MapContainer>
  );
}
