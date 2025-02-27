const mongoose = require("mongoose");

const historialSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  num_juegos: Number,
  preguntas_acertadas: Number,
  preguntas_falladas: Number,
  tiempo_total: Number
});

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  historial: [historialSchema]
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
