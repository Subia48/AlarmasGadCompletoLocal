// models/User.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    cedula: { type: String, required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    rol: {
      type: String,
      enum: ["usuario", "admin", "cuerpo_sos"],
      default: "usuario",
    },
    contactoEmergencia: [contactSchema],
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// transformar salida JSON
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash; // nunca mostrar hash
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
