import axios from "axios";
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const language = "es";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions(callback) {
    console.log("Fetching questions...");
    const tipoPreguntas = ["Geografia", "Cultura", "Pintores", "Futbolistas", "Cantantes"];
    
    // Generar las URLs con el gateway-service
    const urls = Array.from({ length: 10 }, () => {
        const thematic = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
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
        for (let index = 0; index < urls.length; index++) {
            const { url, params, tipo } = urls[index];
            const response = await axios.get(url, { params });

            if (!response.data.responseQuestion || !response.data.responseOptions || !response.data.responseCorrectOption) {
                console.warn(`Datos incompletos para la pregunta ${index + 1}. Respuesta del servidor:`, response.data);
                continue; // Saltar esta pregunta si los datos están incompletos
            }

            const question = {
                id: `q${index + 1}`,
                pregunta: response.data.responseQuestion,
                opciones: response.data.responseOptions,
                respuesta_correcta: response.data.responseOptions.indexOf(response.data.responseCorrectOption),
                imagen: response.data.responseImage,
                tipo: tipo
            };

            // Rellenamos el array en la posición específica
            questionsArray[index] = { ...question };

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
    if (this.questions[questionIndex] && this.questions[questionIndex].respuesta_correcta === selectedOption) {
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
