const express = require("express");
const EmergencyCode = require("../models/EmergencyCode");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * ==============================
 * GET /api/emergency-codes
 * admin, gestor_codigos, cuerpo_sos
 * ==============================
 */
router.get(
  "/",
  auth,
  requireRole("admin", "gestor_codigos", "cuerpo_sos","operador_sos"),
  async (req, res) => {
    try {
      const codes = await EmergencyCode.find({ activo: true }).sort({ codigo: 1 });
      res.json(codes.map((c) => c.toJSON()));
    } catch (err) {
      console.error("Error obteniendo códigos:", err);
      res.status(500).json({ message: "Error obteniendo códigos" });
    }
  }
);

/**
 * ==============================
 * POST /api/emergency-codes
 * admin y gestor_codigos
 * ==============================
 */
router.post(
  "/",
  auth,
  requireRole("admin", "gestor_codigos", "operador_sos"),
  async (req, res) => {
    const { codigo, descripcion } = req.body;

    if (!codigo || !descripcion) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const nuevo = await EmergencyCode.create({ codigo, descripcion });
    res.status(201).json(nuevo.toJSON());
  }
);

/**
 * ==============================
 * PUT /api/emergency-codes/:id
 * admin y gestor_codigos
 * ==============================
 */
router.put(
  "/:id",
  auth,
  requireRole("admin", "gestor_codigos", "operador_sos"),
  async (req, res) => {
    const code = await EmergencyCode.findById(req.params.id);
    if (!code) {
      return res.status(404).json({ message: "Código no encontrado" });
    }

    code.codigo = req.body.codigo ?? code.codigo;
    code.descripcion = req.body.descripcion ?? code.descripcion;
    code.activo = req.body.activo ?? code.activo;

    await code.save();
    res.json(code.toJSON());
  }
);

/**
 * ==============================
 * DELETE /api/emergency-codes/:id
 * admin y gestor_codigos
 * ==============================
 */
router.delete(
  "/:id",
  auth,
  requireRole("admin", "gestor_codigos", "operador_sos"),
  async (req, res) => {
    const code = await EmergencyCode.findById(req.params.id);
    if (!code) {
      return res.status(404).json({ message: "Código no encontrado" });
    }

    await code.deleteOne();
    res.json({ message: "Código eliminado" });
  }
);

module.exports = router;
