import axios from "axios";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions(callback) {
    console.log("Fetching questions...");
    const tipoPreguntas = ["Geografia", "Cultura", "Personajes"];
    
    const urls = Array.from({ length: 10 }, () => {
        const tipoAleatorio = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
        return { url: `http://localhost:8010/generateQuestion?language=es&thematic=${tipoAleatorio}`, tipo: tipoAleatorio };
    });

    // Inicializamos un array vacío con el tamaño adecuado
    const questionsArray = new Array(urls.length).fill(null);

    try {
        for (let [index, { url, tipo }] of urls.entries()) {
            const response = await axios.get(url);

            const question = {
                id: `q${index + 1}`,
                pregunta: response.data.responseQuestion,
                opciones: response.data.responseOptions,
                respuesta_correcta: response.data.responseOptions.indexOf(response.data.responseCorrectOption),
                imagen: response.data.responseImage,
                tipo: tipo
            };

            // Rellenamos el array en la posición específica
            questionsArray[index] = {
                ...question
            };

            console.log(`Pregunta ${index + 1} realizada (${tipo})`);

            // Llamamos al callback con el array actualizado
            if (callback) {
                callback([...questionsArray]); // Usamos [...questionsArray] para evitar mutaciones externas
            }
        }
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
