const express = require('express');
const mongoose = require('mongoose');
const Game = require('./history-model');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(__dirname ,'historyservice.yaml');
const app = express();
const port = 8004;

// Middleware para analizar JSON en el cuerpo de la solicitud
app.use(express.json());

// Conectar a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Función para validar campos requeridos en el cuerpo de la solicitud
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Guardar un nuevo registro de juego
app.post('/savegame', async (req, res) => {
  try {
    validateRequiredFields(req, ['id', 'username', 'points', 'avgtime', 'questions']);

    const newGame = new Game({
      id: req.body.id,
      username: req.body.username,
      points: req.body.points,
      avgtime: req.body.avgtime,
      questions: req.body.questions
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener el historial de juegos de un usuario
app.get('/history/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const gameHistory = await Game.find({ username }).sort({ createdAt: -1 });
    res.json(gameHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas resumidas de un usuario
app.get('/stats/:username', async (req, res) => {
  try {
    const username = req.params.username;
    
    // Agregación para calcular estadísticas
    const stats = await Game.aggregate([
      { $match: { username } },
      { $unwind: { path: "$questions", preserveNullAndEmptyArrays: true } },
      { 
        $group: {
          _id: "$username",
          totalGames: { $addToSet: "$id" },
          totalPoints: { $sum: "$points" },
          correctAnswers: { 
            $sum: { 
              $cond: [{ $eq: ["$questions.correct", true] }, 1, 0] 
            } 
          },
          wrongAnswers: { 
            $sum: { 
              $cond: [{ $eq: ["$questions.correct", false] }, 1, 0] 
            } 
          },
          totalTime: { $sum: "$avgtime" }
        } 
      },
      {
        $project: {
          _id: 0,
          username: "$_id",
          totalGames: { $size: "$totalGames" },
          totalPoints: 1,
          correctAnswers: 1,
          wrongAnswers: 1,
          averageTime: { 
            $cond: [
              { $eq: [{ $size: "$totalGames" }, 0] },
              0,
              { $divide: ["$totalTime", { $size: "$totalGames" }] }
            ]
          }
        }
      }
    ]);
    
    // Si no hay estadísticas, devolver valores por defecto
    if (stats.length === 0) {
      res.json({
        username,
        totalGames: 0,
        totalPoints: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageTime: 0
      });
    } else {
      res.json(stats[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(port, () => {
  console.log(`History Service listening at http://localhost:${port}`);
});

// Escuchar el evento 'close' en el servidor Express.js
server.on('close', () => {
  // Cerrar la conexión de Mongoose
  mongoose.connection.close();
});

module.exports = server;
