// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, clave);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container mobile-center">
      <form className="login-form mobile-form" onSubmit={handleLogin}>

        {/* LOGO */}
        <div className="login-logo">
          <img
            src="/alarmasmart.webp"
            alt="Alarma Smart"
          />
        </div>

  

        {/* EMAIL */}
        <div className="form-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            autoComplete="email"
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <input
            type="password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        {/* BOTÓN LOGIN */}
        <button type="submit" className="btn btn-primary">
          Ingresar
        </button>

        {/* BOTÓN REGISTRO */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/register")}
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
