// src/pages/EditarContactoPage.js
import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EditarContactoPage({ onVolver }) {
  const { user } = useAuth();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contactos, setContactos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (user?.contactoEmergencia) {
      setContactos(user.contactoEmergencia);
    }
  }, [user]);

  const guardarContactos = async (nuevosContactos) => {
    const actualizado = await apiFetch("/users/me/contacto", {
      method: "PUT",
      body: { contactoEmergencia: nuevosContactos },
    });
    setContactos(actualizado.contactoEmergencia);
  };

  const guardarContacto = async () => {
    if (!nombre || !telefono) {
      alert("Complete todos los campos");
      return;
    }

    let nuevosContactos = [...contactos];

    if (editIndex !== null) {
      nuevosContactos[editIndex] = { nombre, telefono };
    } else {
      nuevosContactos.push({ nombre, telefono });
    }

    try {
      await guardarContactos(nuevosContactos);
      setNombre("");
      setTelefono("");
      setEditIndex(null);
      alert("Contacto guardado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  const editarContacto = (index) => {
    setNombre(contactos[index].nombre);
    setTelefono(contactos[index].telefono);
    setEditIndex(index);
  };

  const eliminarContacto = async (index) => {
    if (!window.confirm("¿Eliminar este contacto?")) return;

    const nuevosContactos = contactos.filter((_, i) => i !== index);

    try {
      await guardarContactos(nuevosContactos);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="contactos-page">
      <h2 className="contactos-title">Gestión de Contactos de Emergencia</h2>

      {/* FORMULARIO */}
      <div className="contactos-form">
        <input
          type="text"
          placeholder="Nombre del contacto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono del contacto"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button className="btn btn-success" onClick={guardarContacto}>
          {editIndex !== null ? "Actualizar contacto" : "Guardar contacto"}
        </button>
      </div>

      {/* LISTA */}
      <h3 className="contactos-subtitle">Contactos guardados</h3>

      {contactos.length === 0 ? (
        <p>No hay contactos registrados</p>
      ) : (
        <div className="contactos-table-wrapper">
          <table className="contactos-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((c, index) => (
                <tr key={index}>
                  <td data-label="Nombre">{c.nombre}</td>
                  <td data-label="Teléfono">{c.telefono}</td>
                  <td data-label="Acciones">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => editarContacto(index)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarContacto(index)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-secondary volver-btn" onClick={onVolver}>
        ⬅ Volver
      </button>
    </div>
  );
}
