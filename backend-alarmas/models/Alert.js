// models/Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alarma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alarm",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en_proceso", "atendida"],
      default: "pendiente",
    },
    ubicacionUsuario: {
      lat: Number,
      lng: Number,
    },
    canal: {
      type: String,
      enum: ["movil", "web"],
      default: "movil",
    },
    tipoEmergencia: {
  type: String, // ej: CODIGO_BLANCO
},
descripcionEmergencia: {
  type: String, // ej: Ataque con arma blanca
},
fechaAtencion: {
  type: Date,
},

    enviadaAContactos: { type: Boolean, default: false },
    enviadaAInstituciones: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

alertSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.usuarioId = ret.usuario?._id
      ? ret.usuario._id.toString()
      : ret.usuario?.toString();
    ret.alarmaId = ret.alarma?._id
      ? ret.alarma._id.toString()
      : ret.alarma?.toString();
    ret.ubicacion = ret.ubicacionUsuario;
    delete ret._id;
    delete ret.__v;
    delete ret.ubicacionUsuario;
    return ret;
  },
});

module.exports = mongoose.model("Alert", alertSchema);
