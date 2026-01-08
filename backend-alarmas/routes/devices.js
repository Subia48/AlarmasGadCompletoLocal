// routes/devices.js
const express = require("express");
const Alarm = require("../models/Alarm");

const router = express.Router();

// GET /api/devices/:deviceId/state
// El ESP32 pregunta cada X segundos si debe sonar o no
router.get("/:deviceId/state", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const alarm = await Alarm.findOne({ deviceId });

    if (!alarm) {
      return res
        .status(404)
        .json({ message: "Dispositivo no registrado", estado: "inactiva" });
    }

    res.json({
      deviceId,
      alarmaId: alarm.id,
      estado: alarm.estado, // "activa" o "inactiva"
    });
  } catch (err) {
    console.error("Error en GET /devices/:deviceId/state:", err);
    res.status(500).json({ message: "Error obteniendo estado de dispositivo" });
  }
});

module.exports = router;
