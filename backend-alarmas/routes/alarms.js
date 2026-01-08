// routes/alarms.js
const express = require("express");
const Alarm = require("../models/Alarm");
const Alert = require("../models/Alert");
const { auth, requireRole } = require("../middleware/auth");

console.log("✅ ROUTES ALARMS CARGADAS");

const router = express.Router();

/* =====================================================
   POST /api/alarms/:id/probar
   👉 RUTA ESPECÍFICA (DEBE IR PRIMERA)
   👉 Genera alerta de prueba y activa la alarma
===================================================== */
router.post("/:id/probar", auth, requireRole("admin"), async (req, res) => {
  console.log("🧪 PROBANDO ALARMA", req.params.id);

  try {
    const alarm = await Alarm.findById(req.params.id);
    if (!alarm) {
      return res.status(404).json({ message: "Alarma no encontrada" });
    }

    const coords = alarm.location?.coordinates;
    if (!coords || coords.length !== 2) {
      return res
        .status(400)
        .json({ message: "La alarma no tiene coordenadas válidas" });
    }

    const baseLng = coords[0];
    const baseLat = coords[1];

    // Ubicación cercana (unos metros)
    const lng = baseLng + (Math.random() - 0.5) * 0.0003;
    const lat = baseLat + (Math.random() - 0.5) * 0.0003;

    // Crear alerta de prueba
    const alerta = await Alert.create({
      usuario: req.userId,
      alarma: alarm._id,
      estado: "pendiente",
      canal: "web",
      ubicacionUsuario: { lat, lng },
      timestamp: new Date(),
    });

    // Activar alarma
    alarm.estado = "activa";
    alarm.ultimaActualizacion = new Date();
    await alarm.save();

    return res.status(201).json({
      message: "Alerta de prueba creada y alarma activada",
      alerta: alerta.toJSON(),
    });
  } catch (err) {
    console.error("❌ Error probando alarma:", err);
    return res.status(500).json({ message: "Error probando alarma" });
  }
});

/* =====================================================
   GET /api/alarms
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const alarms = await Alarm.find().sort({ createdAt: -1 });
    res.json(alarms.map((a) => a.toJSON()));
  } catch (err) {
    console.error("Error en GET /alarms:", err);
    res.status(500).json({ message: "Error obteniendo alarmas" });
  }
});

/* =====================================================
   POST /api/alarms  (solo admin)
===================================================== */
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { nombre, direccion, lat, lng, deviceId } = req.body;

    if (!direccion || lat == null || lng == null || !deviceId) {
      return res.status(400).json({
        message: "direccion, lat, lng y deviceId son obligatorios",
      });
    }

    const alarm = await Alarm.create({
      nombre,
      direccion,
      deviceId,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    res.status(201).json(alarm.toJSON());
  } catch (err) {
    console.error("Error en POST /alarms:", err);
    res.status(500).json({ message: "Error creando alarma" });
  }
});

/* =====================================================
   PUT /api/alarms/:id  (solo admin)
===================================================== */
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const { nombre, direccion, lat, lng, estado, deviceId } = req.body;

    const alarm = await Alarm.findById(req.params.id);
    if (!alarm) {
      return res.status(404).json({ message: "Alarma no encontrada" });
    }

    if (nombre !== undefined) alarm.nombre = nombre;
    if (direccion !== undefined) alarm.direccion = direccion;
    if (deviceId !== undefined) alarm.deviceId = deviceId;
    if (estado !== undefined) alarm.estado = estado;

    if (lat != null && lng != null) {
      alarm.location = { type: "Point", coordinates: [lng, lat] };
    }

    alarm.ultimaActualizacion = new Date();
    await alarm.save();

    res.json(alarm.toJSON());
  } catch (err) {
    console.error("Error en PUT /alarms/:id:", err);
    res.status(500).json({ message: "Error actualizando alarma" });
  }
});

/* =====================================================
   DELETE /api/alarms/:id  (solo admin)
===================================================== */
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    await Alarm.findByIdAndDelete(req.params.id);
    res.json({ message: "Alarma eliminada" });
  } catch (err) {
    console.error("Error en DELETE /alarms/:id:", err);
    res.status(500).json({ message: "Error eliminando alarma" });
  }
});

module.exports = router;
