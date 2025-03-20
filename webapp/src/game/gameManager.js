import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Game from './game';
import HourglassTimer from "./HourglassTimer";
import { motion } from 'framer-motion';
import "./OutTimeMessage.css";



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const apiKey = "AIzaSyCNEG2xtR3K1eoEYwMZYjUdxL9eoOEq50o" || 'None';

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
  const [hint, setHint] = useState("");
  const [usedHint, setUsedHint] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  

  const fetchHint = async () => {
    if (usedHint[indice] || loadingHint) return;
    setLoadingHint(true);
    try {
      const question = `Devuelveme una descripcion de ${questions[indice].responseCorrectOption} en mas o menos tres frases sin decir exactamente que es, como si de un acertijo se tratara.`;
      const model = "gemini";
      //const response = await axios.post(`${apiEndpoint}/askllm`, { question, model, apiKey });
      //setHint(response.data.answer);
      setHint("Aqui iria la pista");
      setUsedHint(prev => ({ ...prev, [indice]: true }));
    } catch (error) {
      console.error("Error obteniendo la pista:", error);
      setHint("No se pudo generar la pista. Inténtalo de nuevo más tarde.");
    }
    setLoadingHint(false);
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
      answered: true
    };
    
    setQuestions(updatedQuestions);
    
    // Actualizar puntuación
    if (answerIndex === questions[indice].respuesta_correcta) {
      setScore(score + 10);
    }
    
    // Avanzar a la siguiente pregunta o finalizar
    if (indice < questions.length - 1) {
      setIndice(indice + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
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
  const finishGame = async () => {
    const totalGameTime = (Date.now() - gameStartTime) / 1000; // tiempo total en segundos
    setGameFinished(true);
    
    try {
      const username = localStorage.getItem('username');
      
      // Preparar datos para guardar
      const gameData = {
        id: `game_${Date.now()}`,
        username,
        points: score,
        avgtime: totalGameTime / questions.length,
        questions: questions.map(q => ({
          questionId: q.id,
          question: q.pregunta,
          correct: q.userAnswer === q.respuesta_correcta,
          timeSpent: q.timeSpent || 0
        }))
      };
      
      // Guardar el historial del juego
      await axios.post(`${apiEndpoint}/savegame`, gameData);
      
      setSnackbarMessage('¡Juego guardado correctamente!');
      setSnackbarOpen(true);
      
      // Redirigir al perfil después de un breve retraso
      setTimeout(() => {
        navigate(`/profile/${username}`);
      }, 2000);
      
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
    return <Container><Typography>Cargando...</Typography></Container>;
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
      {/* Imagen de la pregunta */}
      {questions[indice].imagen && (
        <Paper sx={{ padding: 2, marginBottom: 2, textAlign: "center" }}>
          <img 
            src={questions[indice].imagen} 
            alt="Pregunta" 
            style={{ maxHeight: 300, width: "auto", display: "block", margin: "0 auto" }} 
          />
        </Paper>
      )}
      <Paper sx={{ padding: 3, marginBottom: 2, position: "relative" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {questions[indice].pregunta}
        </Typography>

        <Button 
            variant="outlined" 
            color="warning" 
            sx={{ position: "absolute", top: 10, right: 10 }} 
            onClick={fetchHint}
            disabled={usedHint[indice] || loadingHint}
          >
            {loadingHint ? "Cargando..." : "Pedir Pista"}
          </Button>

        <Grid container spacing={7} sx={{ marginTop: 2, alignContent:'center' }}>
          {questions[indice].opciones.map((opcion, i) => (
            <Grid item xs={16} key={i}>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  fontSize: "1rem", 
                  padding: 5,
                  backgroundColor: questions[indice].answered && i === questions[indice].userAnswer 
                    ? (i === questions[indice].respuesta_correcta ? 'green' : 'red')
                    : undefined
                }}
                onClick={() => !questions[indice].answered && handleAnswerSelect(i)}
                disabled={questions[indice].answered || timeLeft==0}
              >
                {opcion}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

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
            Ver mi perfil
          </Button>
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between">
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