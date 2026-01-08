// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");

  // CONTACTO DE EMERGENCIA
  const [contactoNombre, setContactoNombre] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  // 🔐 SOLO NÚMEROS Y 10 DÍGITOS
  const onlyNumbers10 = (value) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // VALIDACIÓN EXTRA (BACKUP)
    if (cedula.length !== 10) {
      return setError("La cédula debe tener 10 dígitos");
    }
    if (telefono.length !== 10) {
      return setError("El teléfono debe tener 10 dígitos");
    }
    if (contactoTelefono.length !== 10) {
      return setError("El teléfono de contacto debe tener 10 dígitos");
    }

    try {
      await register({
        cedula,
        nombre,
        email,
        telefono,
        password: clave,
        contactoEmergencia: [
          {
            nombre: contactoNombre,
            telefono: contactoTelefono,
          },
        ],
      });

      alert("✅ Registro exitoso");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div className="login-container mobile-center">
      <form className="login-form mobile-form" onSubmit={handleRegister}>
        <h2 className="form-title">Registro de Usuario</h2>

        {/* CÉDULA */}
        <input
          type="text"
          placeholder="Cédula"
          required
          inputMode="numeric"
          value={cedula}
          onChange={(e) => setCedula(onlyNumbers10(e.target.value))}
        />

        <input
          type="text"
          placeholder="Nombre completo"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* TELÉFONO */}
        <input
          type="text"
          placeholder="Teléfono"
          required
          inputMode="numeric"
          value={telefono}
          onChange={(e) => setTelefono(onlyNumbers10(e.target.value))}
        />

        <input
          type="password"
          placeholder="Contraseña"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <hr />

        <h4 className="form-subtitle">Contacto de Emergencia</h4>

        <input
          type="text"
          placeholder="Nombre del contacto"
          required
          value={contactoNombre}
          onChange={(e) => setContactoNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono del contacto"
          required
          inputMode="numeric"
          value={contactoTelefono}
          onChange={(e) =>
            setContactoTelefono(onlyNumbers10(e.target.value))
          }
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-success">
          Registrarse
        </button>

        <button
          type="button"
          className="btn btn-cancel"
          onClick={() => navigate("/login")}
        >
          Volver al login
        </button>
      </form>
    </div>
  );
}
