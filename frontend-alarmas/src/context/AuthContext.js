// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ===============================
  // CARGAR USUARIO CON TOKEN
  // ===============================
  useEffect(() => {
    async function cargarUsuario() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await apiFetch("/auth/me");
        setUser(me);
      } catch (err) {
        console.error("Error cargando usuario:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    cargarUsuario();
  }, [token]);

  // ===============================
  // LOGIN
  // ===============================
  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  // ===============================
  // REGISTRO (USUARIO + CONTACTO)
  // ===============================
  const register = async (userData) => {
    /*
      userData esperado:
      {
        cedula,
        nombre,
        email,
        telefono,
        password,
        contactoEmergencia: [
          { nombre, telefono }
        ]
      }
    */

    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: userData,
    });

    return data;
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register, // 👈 IMPORTANTE
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
