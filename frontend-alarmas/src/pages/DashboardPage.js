// src/pages/DashboardPage.js
import React, { useState } from "react";
import AlarmasPage from "./AlarmasPage";
import AlertasPage from "./AlertasPage";
import UsuariosPage from "./UsuariosPage";
import UsuarioHomePage from "./UsuarioHomePage";
import { useAuth } from "../context/AuthContext";
import CodigosEmergenciaPage from "./CodigosEmergenciaPage";


export default function DashboardPage() {
  const [seccion, setSeccion] = useState("alarmas");
  const { user, logout } = useAuth();

  if (!user) return null;

  const rol = user.rol || "usuario";

  return (
    <div className="dashboard-container">
      <header>
        <div className="logo-title-container">
          <img
            src="/alarmasmart.webp"
            width="150px"
            alt="Logo"
            className="logo"
          />
        </div>

        {/* NAV SEGÚN ROL */}
        <nav>
          {rol === "admin" && (
            <>
              <button onClick={() => setSeccion("alarmas")}>Alarmas</button>
              <button onClick={() => setSeccion("alertas")}>Alertas</button>
              <button onClick={() => setSeccion("usuarios")}>Usuarios</button>
              <button onClick={() => setSeccion("codigos")}>
      Códigos de Emergencia
    </button>
            </>
          )}

          {rol === "cuerpo_sos" && (
            <button onClick={() => setSeccion("alertas")}>Alertas</button>
          )}
        </nav>

        <div className="user-info">
          <p>{user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {/* CONTENIDO SEGÚN ROL */}
      {rol === "admin" && (
        <>
          {seccion === "alarmas" && <AlarmasPage />}
          {seccion === "alertas" && <AlertasPage />}
          {seccion === "usuarios" && <UsuariosPage />}
           {seccion === "codigos" && <CodigosEmergenciaPage />}
        </>
      )}

      {rol === "cuerpo_sos" && <AlertasPage />}

      {rol === "usuario" && <UsuarioHomePage />}

      <footer>
        <p>
          <b>© 2025 Alarma Smart. Todos los derechos reservados.</b>
        </p>
      </footer>
    </div>
  );
}
