const express = require("express");
const Usuario = require("../model/Usuario");
const router = express.Router();

// 1. Registrar un usuario
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existeUsuario = await Usuario.findOne({ username });
    if (existeUsuario) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const nuevoUsuario = new Usuario({ username, email, password });
    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 2. Obtener historial de un usuario
router.get("/:username/historial", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ username: req.params.username }, "historial");
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario.historial);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// 3. Agregar una nueva sesión de juego al historial
router.post("/:username/historial", async (req, res) => {
  try {
    const { num_juegos, preguntas_acertadas, preguntas_falladas, tiempo_total } = req.body;
    
    const usuario = await Usuario.findOneAndUpdate(
      { username: req.params.username },
      { $push: { historial: { num_juegos, preguntas_acertadas, preguntas_falladas, tiempo_total } } },
      { new: true }
    );

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar historial" });
  }
});

module.exports = router;
