import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';


function App() {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [image, setImage] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  

  // Cargar una nueva pregunta al iniciar
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      // Cambia la URL del backend por la correcta si es necesario
      const response = await axios.get("http://localhost:8003/generateQuestion?language=es&thematic=Geografia");
      const { responseQuestion, responseOptions, responseCorrectOption, responseImage } = response.data;

      setQuestion(responseQuestion);
      setOptions(responseOptions);
      setCorrectOption(responseCorrectOption);
      setImage(responseImage);
      setSelectedAnswer(null);
      setGameOver(false);
    } catch (error) {
      console.error("Error fetching the question:", error);
    }
  };

  const checkAnswer = (answer) => {
    setSelectedAnswer(answer);

    if (answer === correctOption) {
      setScore(score + 1);
      alert("¡Respuesta correcta!");
    } else {
      alert("Respuesta incorrecta.");
    }
    setGameOver(true);
  };

  const nextQuestion = () => {
    fetchQuestion();
  };

  return (
    <div className="app">
      <h1>Juego de Preguntas</h1>

      {question && (
        <div>
          <p>{question}</p>

          {image && <img src={image} alt="Imagen relacionada" width="300" />}

          <div className="options">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>

          {gameOver && (
            <div>
              <p>{selectedAnswer === correctOption ? "¡Respuesta correcta!" : "Respuesta incorrecta"}</p>
              <button onClick={nextQuestion}>Siguiente Pregunta</button>
            </div>
          )}

          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default App;
