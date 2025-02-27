const express = require("express");
const connectDB = require("./config/db");
const usuarioRoutes = require("./routes/usuarios");

const app = express();
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Usar las rutas de usuario
app.use("/usuarios", usuarioRoutes);

// Iniciar servidor
const PORT = 8000;
app.listen(PORT, () => console.log(Servidor corriendo en http://localhost:${PORT}));
