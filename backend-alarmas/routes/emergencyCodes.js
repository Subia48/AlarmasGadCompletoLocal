const express = require("express");
const EmergencyCode = require("../models/EmergencyCode");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/emergency-codes (admin y cuerpo_sos)
router.get("/", auth, requireRole("admin", "cuerpo_sos"), async (req, res) => {
  const codes = await EmergencyCode.find({ activo: true }).sort({ codigo: 1 });
  res.json(codes.map((c) => c.toJSON()));
});

// POST /api/emergency-codes (solo admin)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  const { codigo, descripcion } = req.body;

  if (!codigo || !descripcion) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const nuevo = await EmergencyCode.create({ codigo, descripcion });
  res.status(201).json(nuevo.toJSON());
});

// PUT /api/emergency-codes/:id (solo admin)
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  const code = await EmergencyCode.findById(req.params.id);
  if (!code) return res.status(404).json({ message: "No encontrado" });

  code.codigo = req.body.codigo ?? code.codigo;
  code.descripcion = req.body.descripcion ?? code.descripcion;
  code.activo = req.body.activo ?? code.activo;

  await code.save();
  res.json(code.toJSON());
});

// DELETE /api/emergency-codes/:id (solo admin)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  await EmergencyCode.findByIdAndDelete(req.params.id);
  res.json({ message: "Código eliminado" });
});

module.exports = router;
