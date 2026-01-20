const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Alert = require("../models/Alert");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * LISTAR USUARIOS
 */
router.get("/", auth, requireRole("admin", "gestor_usuarios"), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(u => u.toJSON()));
});

/**
 * CREAR USUARIO
 */
router.post("/", auth, requireRole("admin", "gestor_usuarios"), async (req, res) => {
  const { cedula, nombre, email, password, rol } = req.body;

  if (!cedula || !nombre || !email || !password) {
    return res.status(400).json({ message: "Campos obligatorios faltantes" });
  }

  if (req.userRol === "gestor_usuarios" && rol === "admin") {
    return res.status(403).json({ message: "No puedes crear administradores" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Correo ya existe" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    cedula,
    nombre,
    email,
    passwordHash: hash,
    rol: rol || "usuario",
  });

  res.status(201).json(user.toJSON());
});

/**
 * CAMBIAR ROL
 */
router.put("/:id/role", auth, requireRole("admin", "gestor_usuarios"), async (req, res) => {
  const { rol } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (req.userRol === "gestor_usuarios" && user.rol === "admin") {
    return res.status(403).json({ message: "No puedes modificar un administrador" });
  }

  if (req.userRol === "gestor_usuarios" && rol === "admin") {
    return res.status(403).json({ message: "No puedes asignar rol admin" });
  }

  user.rol = rol;
  await user.save();

  res.json(user.toJSON());
});

/**
 * ELIMINAR USUARIO COMPLETO
 */
router.delete("/:id/completo", auth, requireRole("admin", "gestor_usuarios"), async (req, res) => {
  const user = await User.findById(req.params.id);

  if (req.userRol === "gestor_usuarios" && user.rol === "admin") {
    return res.status(403).json({ message: "No puedes eliminar un administrador" });
  }

  await Alert.deleteMany({ usuario: user._id });
  await user.deleteOne();

  res.json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;
