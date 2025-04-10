const mongoose = require('mongoose');

//preguntas
const questionSchema = new mongoose.Schema({
  enunciado:{
    type: String,
    required: true,
},
respuesta_correcta: {
    type:String,
    required: true
},
respuesta_falsa1:{
    type:String,
    required:true
},
respuesta_falsa2:{
    type:String,
    required:true
},respuesta_falsa3:{
    type:String,
    required:true,
},imagen: {
    type: String, 
    required: true,
},correct:{
    type: Boolean,
    default: false,
    required: false
}
    });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question