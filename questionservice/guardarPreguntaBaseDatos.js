const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctOption: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);

async function saveQuestionToDB(questionData) {
    try {
        const newQuestion = new Question(questionData);
        await newQuestion.save();
        console.log("Pregunta guardada correctamente.");
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    }
}
