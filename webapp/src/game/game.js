import axios from "axios";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions() {
    this.questions = []; // Reset antes de hacer nuevas llamadas
    const urls = [
      "http://localhost:8010/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8010/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8010/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8010/generateQuestion?language=es&thematic=Geografia"
    ];

    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));

      this.questions = responses.map((response, index) => ({
        id: `q${index + 1}`,
        pregunta: response.data.responseQuestion,
        opciones: response.data.responseOptions,
        respuesta_correcta: response.data.responseOptions.indexOf(response.data.responseCorrectOption),
        imagen: response.data.responseImage, // Agregamos la imagen
      }));

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
