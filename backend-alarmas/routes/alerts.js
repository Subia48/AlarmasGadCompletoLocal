const express = require("express");
const Alert = require("../models/Alert");
const Alarm = require("../models/Alarm");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const enviarSMS = require("../services/smsService");
const formatearTelefono = require("../services/formatearTelefono"); // ✅ NUEVO

const router = express.Router();

/**
 * POST /api/alerts
 * Crear alerta SOS + intentar enviar SMS a contactos
 */
router.post("/", auth, async (req, res) => {
  try {
    const { lat, lng, alarmaId } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({
        message: "Latitud y longitud obligatoria",
      });
    }

    // 1️⃣ Buscar alarma más cercana o por ID
    const alarm = alarmaId
      ? await Alarm.findById(alarmaId)
      : await Alarm.findOne({
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: 2000,
            },
          },
        });

    if (!alarm) {
      return res.status(404).json({
        message: "No se encontró alarma cercana",
      });
    }

    // 2️⃣ Crear alerta
    const alerta = await Alert.create({
      usuario: req.userId,
      alarma: alarm._id,
      ubicacionUsuario: { lat, lng },
      estado: "pendiente",
      canal: "web",
      timestamp: new Date(),
    });

    // 3️⃣ Activar alarma física
    alarm.estado = "activa";
    alarm.ultimaActualizacion = new Date();
    await alarm.save();

    // 4️⃣ Obtener contactos del usuario
    const usuario = await User.findById(req.userId);

    if (usuario?.contactoEmergencia?.length > 0) {
      const mensaje = `🚨 ALERTA SOS 🚨
${usuario.nombre} necesita ayuda urgente.
📍 Ubicación:
https://maps.google.com/?q=${lat},${lng}`;

      for (const c of usuario.contactoEmergencia) {
        const telefonoFormateado = formatearTelefono(c.telefono);

        try {
          await enviarSMS(telefonoFormateado, mensaje);
          console.log("📨 SMS enviado a", telefonoFormateado);
        } catch (smsErr) {
          console.warn(
            "⚠️ No se pudo enviar SMS (Trial / no verificado):",
            telefonoFormateado,
            smsErr.message
          );
        }
      }

      alerta.enviadaAContactos = true;
      await alerta.save();
    }

    // ✅ Respuesta SIEMPRE OK aunque Twilio falle
    res.status(201).json({
      message: "SOS enviado correctamente",
      alerta: alerta.toJSON(),
    });
  } catch (err) {
    console.error("❌ Error en SOS:", err);
    res.status(500).json({
      message: "Error interno enviando SOS",
    });
  }
});

/**
 * PUT /api/alerts/:id/atender
 * Marcar alerta como atendida con tipo de emergencia
 */
router.put("/:id/atender", auth, async (req, res) => {
  try {
    const { tipoEmergencia, descripcionEmergencia } = req.body;

    if (!tipoEmergencia || !descripcionEmergencia) {
      return res.status(400).json({
        message: "Debe seleccionar el tipo de emergencia",
      });
    }

    const alerta = await Alert.findById(req.params.id);
    if (!alerta) {
      return res.status(404).json({
        message: "Alerta no encontrada",
      });
    }

    // 🔒 No permitir doble atención
    if (alerta.estado === "atendida") {
      return res.status(400).json({
        message: "La alerta ya fue atendida",
      });
    }

    alerta.estado = "atendida";
    alerta.tipoEmergencia = tipoEmergencia;
    alerta.descripcionEmergencia = descripcionEmergencia;
    alerta.fechaAtencion = new Date();

    await alerta.save();

    res.json({
      message: "Alerta atendida correctamente",
      alerta: alerta.toJSON(),
    });
  } catch (err) {
    console.error("❌ Error atendiendo alerta:", err);
    res.status(500).json({
      message: "Error atendiendo alerta",
    });
  }
});

module.exports = router;
