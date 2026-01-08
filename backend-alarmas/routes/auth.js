// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  
  try {
     console.log("REQ.BODY 👉", JSON.stringify(req.body, null, 2));
    console.log(
      "contactoEmergencia 👉",
      req.body.contactoEmergencia,
      "tipo:",
      typeof req.body.contactoEmergencia
    );
    const {
      cedula,
      nombre,
      email,
      telefono,
      password,
      contactoEmergencia
    } = req.body;

    if (!email || !password || !nombre || !cedula) {
      return res.status(400).json({
        message: "Faltan campos obligatorios (cedula, nombre, email, password)"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      cedula,
      nombre,
      email,
      telefono,
      passwordHash: hash,
      rol: "usuario",
      contactoEmergencia: contactoEmergencia || []
    });

    return res.status(201).json({
      id: user.id,
      email: user.email
    });
  } catch (err) {
    console.error("Error en /auth/register:", err);
    res.status(500).json({ message: "Error en el registro" });
  }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        cedula: user.cedula,
        telefono: user.telefono,
      },
    });
  } catch (err) {
    console.error("Error en /auth/login:", err);
    res.status(500).json({ message: "Error en el login" });
  }
});

// GET /api/auth/me  -> datos del usuario actual (para React)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user.toJSON());
  } catch (err) {
    console.error("Error en /auth/me:", err);
    res.status(500).json({ message: "Error obteniendo usuario" });
  }
});

module.exports = router;
