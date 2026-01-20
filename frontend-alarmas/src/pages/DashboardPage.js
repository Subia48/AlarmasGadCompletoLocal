// src/pages/DashboardPage.js
import React, { useState } from "react";
import AlarmasPage from "./AlarmasPage";
import AlertasPage from "./AlertasPage";
import UsuariosPage from "./UsuariosPage";
import UsuarioHomePage from "./UsuarioHomePage";
import CodigosEmergenciaPage from "./CodigosEmergenciaPage";
import { useAuth } from "../context/AuthContext";

const ROLE_SECTIONS = {
  admin: ["alarmas", "alertas", "usuarios", "codigos"],
  cuerpo_sos: ["alertas"],
  operador_alertas: ["alarmas", "alertas"],
  gestor_usuarios: ["usuarios"],
  gestor_codigos: ["codigos"],
  operador_sos: ["alarmas", "alertas", "codigos"],
  gestor_alarmas: ["alarmas"],
  usuario: ["home"],
};

const SECTION_COMPONENTS = {
  alarmas: <AlarmasPage />,
  alertas: <AlertasPage />,
  usuarios: <UsuariosPage />,
  codigos: <CodigosEmergenciaPage />,
  home: <UsuarioHomePage />,
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const rol = user?.rol || "usuario";

  const sections = ROLE_SECTIONS[rol] || ["home"];
  const [seccion, setSeccion] = useState(sections[0]);

  return (
    <div className="dashboard-container">
      <header>
        <div className="logo-title-container">
          <img src="/alarmasmart.webp" width="150" alt="Logo" />
        </div>

        {/* NAV DINÁMICO */}
        <nav>
          {sections.map((sec) => (
            <button key={sec} onClick={() => setSeccion(sec)}>
              {sec === "alarmas" && "Alarmas"}
              {sec === "alertas" && "Alertas"}
              {sec === "usuarios" && "Usuarios"}
              {sec === "codigos" && "Códigos de Emergencia"}
              {sec === "home" && "Inicio"}
            </button>
          ))}
        </nav>

        <div className="user-info">
          <p>{user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main>{SECTION_COMPONENTS[seccion]}</main>

      <footer>
        <p>
          <b>© 2025 Alarma Smart. Todos los derechos reservados.</b>
        </p>
      </footer>
    </div>
  );
}
