import axios from "axios";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions() {
    console.log("Fetching questions...");
    this.questions = [];
    let tipoPreguntas = ["Geografia", "Cultura", "Personajes"];

    const urls = Array.from({ length: 4 }, () => {
      const tipoAleatorio = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
      return { url: `http://localhost:8010/generateQuestion?language=es&thematic=${tipoAleatorio}`, tipo: tipoAleatorio };
    });

    try {
      for (let [index, { url, tipo }] of urls.entries()) {
        const response = await axios.get(url);

        this.questions.push({
          id: `q${index + 1}`,
          pregunta: response.data.responseQuestion,
          opciones: response.data.responseOptions,
          respuesta_correcta: response.data.responseOptions.indexOf(response.data.responseCorrectOption),
          imagen: response.data.responseImage, // Agregamos la imagen
          tipo: tipo // Agregamos el tipo de pregunta
        });

        console.log(`Pregunta ${index} realizada (${tipo})`);
      }

      console.log(this.questions);
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
