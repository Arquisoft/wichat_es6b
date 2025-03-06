// users/historyservice/history-model.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    index: true // Añadimos índice para búsquedas más rápidas
  },
  points: {
    type: Number,
    required: true,
  },
  avgtime: {
    type: Number,
    required: true,
  },
  // Añadimos información detallada de las preguntas
  questions: [{
    questionId: String,
    question: String,
    correct: Boolean,
    timeSpent: Number
  }],
  // Mantenemos el campo existente
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
