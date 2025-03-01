const mongoose = require('mongoose');


const monumentSchema = new mongoose.Schema({
  monumento: {
      type: String,
      required: true
  },
  pais: {
      type: String,
      required: false
  }
}, {timestamps: {}});

const Monumento = mongoose.model('Monument', monumentSchema);

module.exports = {
  Monumento
};
