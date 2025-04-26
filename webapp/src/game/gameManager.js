import React, { useState, useEffect, useRef,useCallback} from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Snackbar,Alert, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Game from './game';
import { getContext } from './hintContext.js';
import HourglassTimer from "./HourglassTimer";
import { AnimatePresence, motion } from "framer-motion";
import "./OutTimeMessage.css";
import "./ProgressBar.css";



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const apiKey =  "AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ" || 'None';

const Jugar = () => {

  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [difficulty, setDifficulty] = useState('Fácil');
  const [selectedCategories, setSelectedCategories] = 
    useState(["Geografia", "Cultura", "Futbolistas", "Pintores", "Cantantes"]);
  const [maxTime, setMaxTime] = useState(40); 
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameFinished, setGameFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hint, setHint] = useState({});
  const [usedHint, setUsedHint] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const preguntaActual = questions[indice] || { opciones: [], respuesta_correcta: null, userAnswer: null, answered: false };
  const timerRef = useRef(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  
  // Chat functionality
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLocked, setChatLocked] = useState(false);

  const updateDifficultyAndTime = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    switch (selectedDifficulty) {
      case 'Fácil':
        setMaxTime(40);
        setTimeLeft(40);
        break;
      case 'Medio':
        setMaxTime(30);
        setTimeLeft(30);
        break;
      case 'Difícil':
        setMaxTime(20);
        setTimeLeft(20);
        break;
      default:
        setMaxTime(40);
        setTimeLeft(40);
        break;
    }
  }, [setMaxTime, setTimeLeft, setDifficulty]);
  
  useEffect(() => {
    const storedDifficulty = localStorage.getItem('gameDifficulty');
    if (storedDifficulty) {
      updateDifficultyAndTime(storedDifficulty);
    }
  }, [updateDifficultyAndTime,setSelectedCategories]);

  const handleChatSubmit = async () => {
    if (chatInput.trim() && !chatLocked) {
      setChatLocked(true);
      // Agregar mensaje del usuario al chat
      setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
      setChatInput("");
  
      console.log("Pide cargar pista");
  
      // Si no está cargada, llamar a fetchHint para cargarla
      let actualHint = await fetchHint(chatInput); 
      console.log("Pista cargada");
  
      // Introducir un delay antes de mostrar la pista
      setTimeout(() => {
        const hintValue = actualHint || "Pista no disponible";
        console.log("Se devuelve por chat:", hintValue);
  
        // Agregar la respuesta del bot al chat
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot', text: `Pista: ${hintValue}` }
        ]);
        setChatLocked(false);
      }, 1000); // Espera de 1 segundo
    }
  };

  const clearChat = () => {
    // Reiniciar el estado del chat
    setChatMessages([]);
    console.log("Chat limpio y listo para la siguiente pregunta");
  };

  const LoadingProgressBar = () => {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Cargando preguntas...
        </Typography>
        <Box className="progress-container">
          <div className="progress-bar"></div>
        </Box>
      </Container>
    );
  };

  const fetchHint = async (questionMade) => {
    console.log("gallo");
    
    if (loadingHint) return; // Mantenemos esta verificación para evitar llamadas simultáneas
    setLoadingHint(true);
    
    let fetchedHint = "";
    try {
      const questionText = questions[indice].pregunta;
      const correctAnswer = questions[indice].opciones[questions[indice].respuesta_correcta];

      const tipoDePregunta = questions[indice].tipo;  
      const context = "No digas la respuesta correcta de manera explicita. Tipo de pregunta: " + getContext(tipoDePregunta) +
              ". Responde también teniendo en cuenta esto: " + questionMade;

      console.log("Contexto seleccionado:", context);

      console.log("Consultando la pista para:", questionText);
      console.log("Texto de la persona: ", questionMade);
      
      const question = `Respuesta correcta: ${correctAnswer}.`;
      const model = "gemini";
      const response = await axios.post(`${apiEndpoint}/askllm`, {
        question,
        model,
        apiKey,
        context
      });

      console.log("Respuesta de la API:", response.data);
      fetchedHint = response.data.answer || "Pista no disponible";

      // Actualizamos siempre la pista, sobreescribiendo la anterior si es necesario
      setHint(prev => ({ ...prev, [indice]: fetchedHint }));
      console.log("Hint actualizado:", fetchedHint);

      // Mantenemos registro de que ya se usó la pista (puedes adaptarlo según necesidad)
      setUsedHint(prev => ({ ...prev, [indice]: true }));
    } catch (error) {
      setHint(prevHints => ({
        ...prevHints,
        [indice]: "Error obteniendo pista"
      }));
    }
    
    setLoadingHint(false);
    return fetchedHint;
};


  const loadContext = async () => {
    try {
      const response = await fetch('/hintContext.txt'); // Ruta relativa al `public/`
      if (!response.ok) throw new Error("No se pudo cargar el contexto.");
      return await response.text();
    } catch (error) {
      console.error("Error cargando el contexto:", error);
      return "Genera una pista en español sobre la respuesta correcta sin revelar directamente la respuesta.";
    }
  };


  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
        navigate('/');
        return;
    }

    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());

    const storedCategories = localStorage.getItem('selectedCategories');
    console.log(storedCategories.split(',').map(cat => cat.trim()));

    var auxCategories = selectedCategories;

    if(storedCategories!==null){
      auxCategories = storedCategories.split(',').map(cat => cat.trim());
    }
    
    const gameInstance = new Game(auxCategories);
    
    gameInstance.fetchQuestions(updatedQuestions => {
        setQuestions(updatedQuestions.map(q => q ? {
            ...q,
            userAnswer: null,
            timeSpent: 0,
            answered: false
        } : null));
    }).then(() => {
        setLoading(false);
    });

    return () => {
      if (gameInstance) {
        gameInstance.cancelRequests();
      }
    };
  } , [navigate, setSelectedCategories]);

  

  //reinicia el tiempo por pregunta
  useEffect(() => {
    if (gameFinished || questions.length === 0) return;

    setTimeLeft(maxTime);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => handleTimeout(), 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [indice, questions.length]);
  
  // Manejar la selección de respuesta
  const handleAnswerSelect = (answerIndex) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const now = Date.now();
    const timeSpent = (now - questionStartTime) / 1000;
  
    const updatedQuestions = [...questions];
    updatedQuestions[indice] = {
      ...updatedQuestions[indice],
      userAnswer: answerIndex,
      timeSpent: timeSpent,
      answered: true,
    };
    clearChat();
    setQuestions(updatedQuestions);
  
    const updatedScore = score + (answerIndex === questions[indice].respuesta_correcta ? 10 : 0);
  
    if (answerIndex === questions[indice].respuesta_correcta) {
      setShowCorrectAnswer(true);
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 3000);
    }
  
    setTimeout(() => {
      if (indice < questions.length - 1) {
        console.log("Indice:", indice);
        setIndice(indice + 1);
        console.log("IndiceNuevo:", indice);
        setQuestionStartTime(Date.now());
        setScore(updatedScore);
      } else {
        finishGame(updatedScore);
      }
    }, 3000);
  };

  //marca pregunta como fallida si se acaba el tiempo
  const handleTimeout = () => {
  setShowTimeoutMessage(true);

  setTimeout(() => {
    setShowTimeoutMessage(false);
    clearChat();

    const updatedQuestions = [...questions];
    updatedQuestions[indice] = {
      ...updatedQuestions[indice],
      userAnswer: null,
      timeSpent: maxTime,
      answered: true
    };
    setQuestions(updatedQuestions);

    // No suma puntos si no responde
    const updatedScore = score;

    if (indice < questions.length - 1) {
      console.log("Indice:", indice);
      setIndice(indice + 1);
      console.log("IndiceNuevo:", indice);
      setQuestionStartTime(Date.now());
      setScore(updatedScore); // asegura que el score se actualiza
    } else {
      finishGame(updatedScore); //  pasa el score final
    }
  }, 3000);
};



  // Finalizar el juego
  const finishGame = async (finalScore) => {
    const totalGameTime = (Date.now() - gameStartTime) / 1000; // tiempo total en segundos
    setGameFinished(true);
  
    try {
      const username = localStorage.getItem('username');
      console.log("Score:", finalScore); // Usar el puntaje actualizado
      setScore(finalScore); // Actualizar el puntaje final
  
      // Preparar datos para guardar
      const gameData = {
        id: `game_${Date.now()}`,
        username,
        points: finalScore, // Usar el puntaje actualizado
        avgtime: totalGameTime / questions.length,
        questions: questions.map((q) => ({
          questionId: q.id,
          question: q.pregunta,
          correct: q.userAnswer === q.respuesta_correcta,
          timeSpent: q.timeSpent || 0,
          imageUrl: q.imagen // Añadimos la URL de la imagen
        })),
      };
  
      // Guardar el historial del juego
      await axios.post(`${apiEndpoint}/savegame`, gameData);
  
      setSnackbarMessage('¡Juego guardado correctamente!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error guardando el historial del juego:', error);
      setSnackbarMessage('Error al guardar el juego');
      setSnackbarOpen(true);
    }
  };
  
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (questions.length ===0|| (!questions[indice] && !gameFinished && indice < questions.length - 1)) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Cargando preguntas...
        </Typography>
        <Box className="progress-container">
          <div className="progress-bar"></div>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Mensaje animado de "Tiempo Agotado" */}
      {showTimeoutMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="timeout-message"
          
        >
          ⏳ ¡Tiempo Agotado!
        </motion.div>
      )}
  
      {/* Mensaje animado de "Respuesta Correcta" */}
      {showCorrectAnswer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="correct-answer"
        >
          +10 
        </motion.div>
      )}
      
    {/* Mostrar solo el bloque final si el juego terminó */}
    {gameFinished ? (
      <Box
        sx={{
          width: "50vw",
          height: "50vh",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          background: "#f0f0f0",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 2, type: "spring" }}
          style={{
            width: "40vw",
            maxWidth: "90vw",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            padding: 40,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>¡Juego terminado!</Typography>
          <Typography variant="h5" gutterBottom>Puntuación final: {score}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2 }}
            onClick={() => navigate(`/profile/${localStorage.getItem("username")}`)}
          >
            Ver mi historial
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Volver a jugar
          </Button>
        </motion.div>
      </Box>
) : (
  <AnimatePresence mode="wait">
    <motion.div
      key={indice}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        perspective: 1200,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "65vh",
          maxWidth: "80vw",
          maxHeight: "65vh",
          overflow: "hidden",
          margin: "7.5vh auto",
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          padding: "1rem 2rem",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ 
          minHeight: "4rem",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          overflow: "hidden"
        }}>
          <Typography 
            variant="h4" 
            align="center" 
            className="neon-text"
            sx={{ 
              fontFamily: 'NeonSans, sans-serif',
              fontWeight: "bold", 
              fontSize: "4rem", 
              lineHeight: 1,
              color: '#ffffff',
              textShadow: `
                0 0 5px #ff00f7,
                0 0 10px #ff00f7,
                0 0 15px #00b3ff,
                0 0 20px #00b3ff,
                0 0 25px #ff00f7,
                0 0 30px #ff00f7
              `
            }}>
            Pregunta {indice + 1} de {questions.length}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right", mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
            Puntuación: {score}
          </Typography>
          <HourglassTimer timeLeft={timeLeft} totalTime={maxTime} />
        </Box>

        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          flexGrow: 1,
          height: "calc(100% - 8rem)",
          overflow: "hidden"
        }}>
          {/* Chat (izquierda) */}
          <Box
            sx={{
              flex: "0 0 20%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              border: '2px solid #ff00f7',
              boxShadow: '0 0 5px #ff00f7'
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: 1,
                textAlign: "center",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography variant="h6">WiChat AI</Typography>
            </Box>

            <Paper
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 2,
                minHeight: 0, // <-- evita expansión forzada
              }}
            >
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    marginY: 1,
                  }}
                >
                  <Typography
                    sx={{
                      maxWidth: "70%",
                      padding: 1,
                      borderRadius: 10,
                      backgroundColor: "#f9f9f9",
                      color: "#000",
                      textAlign: "left",
                      boxShadow: 1,
                    }}
                  >
                    <strong>{msg.sender === "user" ? "Tú:" : "WiChat AI:"}</strong> {msg.text}
                  </Typography>
                </Box>
              ))}
            </Paper>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                backgroundColor: "#f0f0f0",
                borderTop: "1px solid #ccc",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe un mensaje..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  marginRight: 1,
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 10,
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                onClick={handleChatSubmit}
                disabled={chatLocked}
              >
                Enviar
              </Button>
            </Box>
          </Box>

          {/* Imagen (centro) */}
          <Container
            sx={{
              width: "40%",
              maxWidth: "40%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
              border: '2px solid #00b3ff',
              boxShadow: '0 0 5px #00b3ff'
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {questions[indice] && questions[indice].imagen ? (
                <img
                  src={questions[indice].imagen}
                  alt="Pregunta"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No hay imagen para esta pregunta
                </Typography>
              )}
            </Box>
          </Container>

          {/* Pregunta y opciones (derecha) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              borderRadius: 2,
              padding: 2,
              overflow: "hidden",
              border: '2px solid #50ff00',
              boxShadow: '0 0 5px #50ff00'
            }}
          >
            <Typography 
              variant="h5" 
              align="center" 
              className="neon-text"
              sx={{ 
                fontSize: "1.3rem", 
                mb: 1,
                color: '#ffffff',
                textShadow: `
                  0 0 5px #ff00f7,
                  0 0 10px #ff00f7,
                  0 0 15px #00b3ff,
                  0 0 20px #00b3ff,
                  0 0 25px #ff00f7,
                  0 0 30px #ff00f7
                `
              }}>
             {questions[indice] ? questions[indice].pregunta : ""}
            </Typography>

            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 1, 
              flexGrow: 1,
              overflow: "hidden"
            }}>
              {preguntaActual.opciones.map((opcion, i) => (
                <Button
                  key={i}
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: "1.2rem",
                    padding: 2,
                    bgcolor: 'transparent',
                    border: '2px solid #00b3ff',
                    color: 'black',
                    flexGrow: 1,
                    transition: 'all 0.3s ease',
                    boxShadow: `
                      0 0 5px #00b3ff,
                      inset 0 0 5px #00b3ff
                    `,
                    '&:hover': {
                      bgcolor: 'rgba(0, 179, 255, 0.1)',
                      boxShadow: `
                        0 0 10px #00b3ff,
                        inset 0 0 10px #00b3ff
                      `,
                      border: '2px solid #00b3ff',
                      transform: 'scale(1.02)'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 
                        i === preguntaActual.respuesta_correcta
                          ? "transparent"
                          : i === preguntaActual.userAnswer
                            ? "transparent"
                            : 'rgba(255, 255, 255, 0.1)',
                      border: 
                        i === preguntaActual.respuesta_correcta
                          ? '2px solid #50ff00'
                          : i === preguntaActual.userAnswer
                            ? '2px solid #ff0055'
                            : '2px solid #666',
                      boxShadow:
                        i === preguntaActual.respuesta_correcta
                          ? `
                            0 0 10px #50ff00,
                            inset 0 0 10px #50ff00
                          `
                          : i === preguntaActual.userAnswer
                            ? `
                              0 0 10px #ff0055,
                              inset 0 0 10px #ff0055
                            `
                            : 'none',
                      color: 
                        (i === preguntaActual.respuesta_correcta || i === preguntaActual.userAnswer)
                          ? 'black'
                          : 'rgba(0, 0, 0, 0.5)'
                    }
                  }}
                  onClick={() => !preguntaActual.answered && handleAnswerSelect(i)}
                  disabled={preguntaActual.answered || timeLeft === 0}
                >
                  {opcion}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>


        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Box>
    </motion.div>
  </AnimatePresence>
        )}
    </>
  );
}
export default Jugar;