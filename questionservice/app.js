import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const questions = [
  {
    question: "¿Cuál es la capital de Francia?",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
    answers: ["Madrid", "Londres", "París", "Berlín"],
    correct: 2,
  },
  {
    question: "¿Cuál es el planeta más grande del sistema solar?",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    answers: ["Marte", "Tierra", "Júpiter", "Venus"],
    correct: 2,
  },
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentQuestion]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setIsCorrect(index === questions[currentQuestion].correct);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        alert("¡Juego terminado!");
        setCurrentQuestion(0);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md p-4 text-center shadow-lg">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
          <img
            src={questions[currentQuestion].image}
            alt="question"
            className="w-full h-48 object-cover rounded mb-4"
          />
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].answers.map((answer, index) => (
              <motion.button
                key={index}
                className={`p-2 rounded text-white font-bold text-lg transition-all ${
                  selectedAnswer === index
                    ? isCorrect
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-500 hover:bg-blue-700"
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
