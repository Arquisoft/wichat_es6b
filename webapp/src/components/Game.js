import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const maxTime = 30;//Tiempo maximo para contestar a una pregunta 

const preguntas = [
  {
    id: "q1",
    pregunta: "¿Cuál es la capital de Francia?",
    opciones: ["Berlín", "Madrid", "París", "Lisboa"],
    respuesta_correcta: 2,
  },
  {
    id: "q2",
    pregunta: "¿Cuánto es 5 + 7?",
    opciones: ["10", "11", "12", "13"],
    respuesta_correcta: 2,
  },
  {
    id: "q3",
    pregunta: "¿Quién escribió 'El Quijote'?",
    opciones: ["Lope de Vega", "Cervantes", "Quevedo", "Góngora"],
    respuesta_correcta: 1,
  },
  {
    id: "q4",
    pregunta: "¿Cuál es el planeta más grande del Sistema Solar?",
    opciones: ["Marte", "Júpiter", "Saturno", "Neptuno"],
    respuesta_correcta: 1,
  },
];

const Game = () => {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [gameFinished, setGameFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Inicializar el juego
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
      return;
    }
    
    // Inicializar tiempo de juego y preguntas
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
    
    // Copiar las preguntas y añadir campos para tracking
    setQuestions(preguntas.map(q => ({
      ...q,
      userAnswer: null,
      timeSpent: 0,
      answered: false
    })));
  }, [navigate]);

  //reinicia el tiempo por pregunta
  
  
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
    if (answerIndex === preguntas[indice].respuesta_correcta) {
      setScore(score + 10);
    }
    
    // Avanzar a la siguiente pregunta o finalizar
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishGame();
    }
  };

  //marca pregunta como fallida si se acaba el tiempo

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
        avgtime: totalGameTime / preguntas.length,
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
    if (indice < preguntas.length - 1) {
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
    <Container maxWidth="lg" sx={{ marginTop: 12, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Pregunta {indice + 1} de {preguntas.length}
      </Typography>
      
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Typography variant="h6">
          Puntuación: {score}
        </Typography>
      </Box>

      <Paper sx={{ padding: 3, marginBottom: 2, position: "relative" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {questions[indice].pregunta}
        </Typography>

        <Button 
          variant="outlined" 
          color="warning" 
          sx={{ position: "absolute", top: 10, right: 10 }} 
        >
          Pedir Pista
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
                disabled={questions[indice].answered}
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
            disabled={indice === preguntas.length - 1 || questions[indice].answered}
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
  );
};

export default Game;
