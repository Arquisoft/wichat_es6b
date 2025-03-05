const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: {
      type: String,
      required: true,
  },
  username: {
      type: String,
      required: true,
  },
  points: {
      type: Number,
      required: true,
  },
  avgtime: {
    type: Number,
    required: true,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game