const mongoose = require("mongoose");

const emergencyCodeSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true, // ej: CODIGO_BLANCO
    },
    descripcion: {
      type: String,
      required: true, // ej: Ataque con arma blanca
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

emergencyCodeSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("EmergencyCode", emergencyCodeSchema);
