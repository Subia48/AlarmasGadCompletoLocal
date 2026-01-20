// routes/adminAlerts.js
const express = require("express");
const Alert = require("../models/Alert");
const Alarm = require("../models/Alarm");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/alerts?estado=pendiente
router.get("/", auth, requireRole("admin", "cuerpo_sos", "operador_sos"), async (req, res) => {
  try {
    const { estado } = req.query;
    const query = {};
    if (estado) query.estado = estado;

    const alertas = await Alert.find(query)
      .sort({ createdAt: -1 })
      .populate("usuario", "nombre email")
      .populate("alarma", "direccion location estado");

    const resp = alertas.map((a) => ({
      id: a.id,
      usuarioId: a.usuario ? a.usuario.id : a.usuarioId,
      alarmaId: a.alarma ? a.alarma.id : a.alarmaId,
      estado: a.estado,
      ubicacion: a.ubicacionUsuario,
      timestamp: a.timestamp,
      tipoEmergencia: a.tipoEmergencia,
      descripcionEmergencia: a.descripcionEmergencia,
      fechaAtencion: a.fechaAtencion,
    }));

    res.json(resp);
  } catch (err) {
    console.error("Error en GET /admin/alerts:", err);
    res.status(500).json({ message: "Error obteniendo alertas" });
  }
});

// PUT /api/admin/alerts/:id/atender
router.put(
  "/:id/atender",
  auth,
  requireRole("admin", "cuerpo_sos", "operador_sos"),
  async (req, res) => {
    try {
      const { tipoEmergencia, descripcionEmergencia } = req.body;

      console.log("📥 BODY RECIBIDO EN ATENDER:", req.body);

      if (!tipoEmergencia || !descripcionEmergencia) {
        return res.status(400).json({
          message: "Debe seleccionar el tipo de emergencia",
        });
      }

      const alerta = await Alert.findById(req.params.id);
      if (!alerta) {
        return res.status(404).json({ message: "Alerta no encontrada" });
      }

      // 🔒 evitar doble atención
      if (alerta.estado === "atendida") {
        return res.status(400).json({
          message: "La alerta ya fue atendida",
        });
      }

      // ✅ AQUÍ ESTABA EL PROBLEMA
      alerta.estado = "atendida";
      alerta.tipoEmergencia = tipoEmergencia;
      alerta.descripcionEmergencia = descripcionEmergencia;
      alerta.fechaAtencion = new Date();

      await alerta.save();

      const alarm = await Alarm.findById(alerta.alarma);
      if (alarm) {
        alarm.estado = "inactiva";
        alarm.ultimaActualizacion = new Date();
        await alarm.save();
      }

      res.json({
        message: "Alerta marcada como atendida",
        alerta: alerta.toJSON(),
      });
    } catch (err) {
      console.error("Error en PUT /admin/alerts/:id/atender:", err);
      res.status(500).json({ message: "Error actualizando alerta" });
    }
  }
);

module.exports = router;
