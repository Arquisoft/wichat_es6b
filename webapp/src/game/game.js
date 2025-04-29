import axios from "axios";
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const language = "es";

class Game {

  constructor(arrayPreguntas) {
    this.questions = [];
    this.score = 0;
    this.tipoPreguntas = arrayPreguntas;
    this.controller = new AbortController();
  }

  cancelRequests() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  async fetchQuestions(callback) {
    console.log("Fetching questions...");
    //const tipoPreguntas = ["Geografia", "Cultura", "Pintores", "Futbolistas", "Cantantes"];
    
    const urls = Array.from({ length: 10 }, () => {
        const thematic = this.tipoPreguntas[Math.floor(Math.random() * this.tipoPreguntas.length)];
        return { 
            url: `${apiEndpoint}/generateQuestions`, 
            params: { 
                language, 
                thematic 
            },
            tipo: thematic 
        };
    });

    // Inicializamos un array vacío con el tamaño adecuado
    const questionsArray = new Array(urls.length).fill(null);

    try {
        for (let [index, { url, params, tipo }] of urls.entries()) {
            const response = await axios.get(url, { 
                params,
                signal: this.controller.signal
            });

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
    if (this.questions[questionIndex] && selectedOption === this.questions[questionIndex].respuesta_correcta) {
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