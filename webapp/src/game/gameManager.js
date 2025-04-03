import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Snackbar,Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Game from './game';
import { getContext } from './hintContext.js';
import HourglassTimer from "./HourglassTimer";
import { motion } from 'framer-motion'; //npm install framer-motion
import "./OutTimeMessage.css";
import "./ProgressBar.css";



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const apiKey =  "AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ" || 'None';

const maxTime = 30;//Tiempo maximo para contestar a una pregunta 

const Jugar = () => {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(maxTime);
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

  const fetchHint = async () => {
    console.log("gallo");
    if (usedHint[indice] || loadingHint) return;
    setLoadingHint(true);
    try {
      const questionText = questions[indice].pregunta;
      const optionsText = questions[indice].opciones.join(', ');
      const correctAnswer = questions[indice].opciones[questions[indice].respuesta_correcta];

      const tipoDePregunta = questions[indice].tipo;  
      const context = "No digas la respuesta correcta de manera explicita. "+getContext(tipoDePregunta);

      console.log("Contexto seleccionado:", context);

      console.log("Consultando la pista para:", questionText);
      const question = `Respuesta correcta: ${correctAnswer}.`;
      const model = "gemini";
      const response = await axios.post(`${apiEndpoint}/askllm`, {
        question,
        model,
        apiKey,
        context
      });
      console.log("Respuesta de la API:", response); //
      setHint(prev => ({ ...prev, [indice]: response.data.answer || 'Pista no disponible' }));
      setUsedHint(prev => ({ ...prev, [indice]: true }));
    } catch (error) {
      setHint(prevHints => ({
        ...prevHints,
        [indice]: "Error obteniendo pista"
      }));
    }
    setLoadingHint(false);
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


  // Inicializar el juego
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
      return;
    }

    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());

    const gameInstance = new Game();
    gameInstance.fetchQuestions().then(fetchedQuestions => {
      if (fetchedQuestions) {
        setQuestions(fetchedQuestions.map(q => ({
          ...q,
          userAnswer: null,
          timeSpent: 0,
          answered: false
        })));
      }
      setLoading(false);
    });
  }, [navigate]);

  //reinicia el tiempo por pregunta
  useEffect(() => {
    if (gameFinished || questions.length === 0) return;

    setTimeLeft(maxTime);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [indice,questions]);
  
  // Manejar la selección de respuesta
  const handleAnswerSelect = (answerIndex) => {
    const now = Date.now();
    const timeSpent = (now - questionStartTime) / 1000; // tiempo en segundos
  
    // Actualizar la pregunta actual con la respuesta y el tiempo
    const updatedQuestions = [...questions];
    updatedQuestions[indice] = {
      ...updatedQuestions[indice],
      userAnswer: answerIndex,
      timeSpent: timeSpent,
      answered: true,
    };
  
    setQuestions(updatedQuestions);
  
    // Calcular el puntaje actualizado
    const updatedScore = score + (answerIndex === questions[indice].respuesta_correcta ? 10 : 0);
  
    // Actualizar puntuación
    if (answerIndex === questions[indice].respuesta_correcta) {
      setShowCorrectAnswer(true);
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 1500);
    }
  
    // Avanzar a la siguiente pregunta o finalizar
    if (indice < questions.length - 1) {
      setIndice(indice + 1);
      setQuestionStartTime(Date.now());
      setScore(updatedScore); // Actualizar el estado del puntaje
    } else {
      finishGame(updatedScore); // Pasar el puntaje actualizado a finishGame
    }
  };

//marca pregunta como fallida si se acaba el tiempo
const handleTimeout = () => {
  setShowTimeoutMessage(true); // Mostrar mensaje

  setTimeout(() => {
    setShowTimeoutMessage(false); // Ocultar mensaje tras 1.5s

    const updatedQuestions = [...questions];
    updatedQuestions[indice] = {
      ...updatedQuestions[indice],
      userAnswer: null,
      timeSpent: maxTime,
      answered: true
    };
    setQuestions(updatedQuestions);

    if (indice < questions.length - 1) {
      setIndice(indice + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
    }
  }, 1500); // Mantiene el mensaje visible 1.5 segundos antes de cambiar
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
  
  const handleSiguiente = () => {
    if (indice < questions.length - 1) {
      setIndice(indice + 1);
    }
  };

  const handleAnterior = () => {
    if (indice > 0) {
      setIndice(indice - 1);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!questions.length) {
    return <LoadingProgressBar />;
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
  
      <Container maxWidth="lg" sx={{ marginTop: 12, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Pregunta {indice + 1} de {questions.length}
        </Typography>
        
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Typography variant="h6">
            Puntuación: {score}
          </Typography>
          <HourglassTimer timeLeft={timeLeft} totalTime={maxTime} />
        </Box>
        
        {/* Nueva estructura: Grid para colocar imagen a la izquierda y preguntas a la derecha */}
        <Grid container spacing={3}>
          {/* Imagen de la pregunta (izquierda) */}
          <Grid item xs={12} md={4}>
            {questions[indice].imagen ? (
              <Paper sx={{ padding: 2, textAlign: "center", height: "100%" }}>
                <img 
                  src={questions[indice].imagen} 
                  alt="Pregunta" 
                  style={{ maxHeight: 300, width: "100%", objectFit: "contain" }} 
                />
              </Paper>
            ) : (
              <Paper sx={{ padding: 2, textAlign: "center", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  No hay imagen para esta pregunta
                </Typography>
              </Paper>
            )}
          </Grid>
          
          {/* Pregunta y opciones (derecha) */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, position: "relative" }}>
              <Typography variant="h5" align="center" gutterBottom>
                {questions[indice].pregunta}
              </Typography>
              
              {/* Área de pista */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                gap: 2
              }}>
                <Button 
                  variant="contained" 
                  color="warning" 
                  onClick={fetchHint}
                  disabled={usedHint[indice] || loadingHint}
                  sx={{ flexShrink: 0 }}
                >
                  {loadingHint ? "Cargando..." : "Pedir Pista"}
                </Button>
                
                {/* Área para la pista con efecto de aparición */}
                {hint[indice] && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      flexGrow: 1,
                      animation: 'fadeIn 0.5s',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  >
                    <strong>Pista:</strong> {hint[indice]}
                  </Alert>
                )}
              </Box>
  
              {/* Opciones de respuesta */}
              <Grid container spacing={1} sx={{ marginTop: 2 }}>
                {questions[indice].opciones.map((opcion, i) => (
                  <Grid item xs={12} key={i}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        fontSize: "1rem", 
                        padding: 2,
                        backgroundColor: questions[indice].answered && i === questions[indice].userAnswer 
                          ? (i === questions[indice].respuesta_correcta ? 'green' : 'red')
                          : undefined
                      }}
                      onClick={() => !questions[indice].answered && handleAnswerSelect(i)}
                      disabled={questions[indice].answered || timeLeft === 0}
                    >
                      {opcion}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
  
        {gameFinished ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4">¡Juego terminado!</Typography>
            <Typography variant="h5">Puntuación final: {score}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate(`/profile/${localStorage.getItem('username')}`)}
            >
              Ver mi historial
            </Button>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleAnterior} 
              disabled={indice === 0 || questions[indice].answered}
            >
              Anterior Pregunta
            </Button>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSiguiente} 
              disabled={indice === questions.length - 1 || questions[indice].answered}
            >
              Siguiente Pregunta
            </Button>
          </Box>
        )}
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </>
  );
};

export default Jugar;