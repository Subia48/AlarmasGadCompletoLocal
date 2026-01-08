// routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Alert = require("../models/Alert");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/users  -> lista de usuarios (panel admin)
router.get("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((u) => u.toJSON()));
  } catch (err) {
    console.error("Error en GET /users:", err);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
});

// POST /api/users  -> crear usuario desde panel admin
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const {
      cedula,
      nombre,
      email,
      telefono,
      password,
      rol,
      contactoEmergencia
    } = req.body;

    if (!cedula || !nombre || !email || !password) {
      return res.status(400).json({
        message: "cedula, nombre, email y password son obligatorios"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Correo ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      cedula,
      nombre,
      email,
      telefono,
      passwordHash: hash,
      rol: rol || "usuario",
      contactoEmergencia: contactoEmergencia || []
    });

    res.status(201).json(user.toJSON());
  } catch (err) {
    console.error("Error en POST /users:", err);
    res.status(500).json({ message: "Error creando usuario" });
  }
});

// GET /api/users/me  -> datos del usuario actual (Android)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user.toJSON());
  } catch (err) {
    console.error("Error en GET /users/me:", err);
    res.status(500).json({ message: "Error obteniendo usuario" });
  }
});

// PUT /api/users/me/contacto  -> actualizar contactos de emergencia
router.put("/me/contacto", auth, async (req, res) => {
  try {
    const { contactoEmergencia } = req.body; // debe ser array [{nombre, telefono}, ...]

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.contactoEmergencia = contactoEmergencia || [];
    await user.save();

    res.json(user.toJSON());
  } catch (err) {
    console.error("Error en PUT /users/me/contacto:", err);
    res.status(500).json({ message: "Error actualizando contacto" });
  }
});

// PUT /api/users/:id/role  -> cambiar rol
router.put("/:id/role", auth, requireRole("admin"), async (req, res) => {
  try {
    const { rol } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.rol = rol || user.rol;
    await user.save();

    res.json(user.toJSON());
  } catch (err) {
    console.error("Error en PUT /users/:id/role:", err);
    res.status(500).json({ message: "Error actualizando rol" });
  }
});

// DELETE /api/users/:id  -> eliminar usuario simple
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error en DELETE /users/:id:", err);
    res.status(500).json({ message: "Error eliminando usuario" });
  }
});

// DELETE /api/users/:id/completo  -> eliminar usuario + alertas
router.delete("/:id/completo", auth, requireRole("admin"), async (req, res) => {
  try {
    const userId = req.params.id;
    await Alert.deleteMany({ usuario: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: "Usuario y alertas eliminados" });
  } catch (err) {
    console.error("Error en DELETE /users/:id/completo:", err);
    res.status(500).json({ message: "Error eliminando usuario completo" });
  }
});

module.exports = router;
