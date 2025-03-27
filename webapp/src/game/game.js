import axios from "axios";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions() {
    console.log("Fetching questions..."); // <-- Agrega esto
    this.questions = []; // Reset antes de hacer nuevas llamadas
    let tipoPreguntas=["Geografia","Cultura","Personajes"]
    const urls = Array.from({ length: 4 }, () => {
      const tipoAleatorio = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
      return `http://localhost:8010/generateQuestion?language=es&thematic=${tipoAleatorio}`;
    });

    try {
      for (let [index, url] of urls.entries()) {
        const response = await axios.get(url);

    
        this.questions.push({
          id: `q${index + 1}`,
          pregunta: response.data.responseQuestion,
          opciones: response.data.responseOptions,
          respuesta_correcta: response.data.responseOptions.indexOf(response.data.responseCorrectOption),
          imagen: response.data.responseImage, // Agregamos la imagen
        });
        console.log("Pregunta "+index+" realizada");
      }

      console.log(this.questions)
      return this.questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return null;
    }
  }

  checkAnswer(questionIndex, selectedOption) {
    if (this.questions[questionIndex] && this.questions[questionIndex].responseCorrectOption === selectedOption) {
      this.score += 10;
      return true;
    }
    return false;
  }

  getTotalScore() {
    return this.score;
  }
}

export default Game;
