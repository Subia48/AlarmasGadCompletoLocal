// models/Alarm.js
const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    nombre: { type: String },
    direccion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["activa", "inactiva"],
      default: "inactiva",
    },
    deviceId: { type: String, required: true }, // ID/alias del ESP32

    // ubicación en formato GeoJSON [lng, lat]
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    ultimaActualizacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// índice geoespacial para $near
alarmSchema.index({ location: "2dsphere" });

// virtuales lat/lng para que el frontend los consuma fácil
alarmSchema.virtual("lat").get(function () {
  return this.location?.coordinates?.[1];
});

alarmSchema.virtual("lng").get(function () {
  return this.location?.coordinates?.[0];
});

alarmSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Alarm", alarmSchema);
