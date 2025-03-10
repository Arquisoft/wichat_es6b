import axios from "axios";

class Game {
  constructor() {
    this.questions = [];
    this.score = 0;
  }

  async fetchQuestions() {
    this.questions = []; // Reset antes de hacer nuevas llamadas
    const urls = [
      "http://localhost:8003/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8003/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8003/generateQuestion?language=es&thematic=Geografia",
      "http://localhost:8003/generateQuestion?language=es&thematic=Geografia"
    ];

    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      this.questions = responses.map(response => response.data);
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