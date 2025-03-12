import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const apiKey = "AIzaSyCNEG2xtR3K1eoEYwMZYjUdxL9eoOEq50o" || 'None';

const preguntas = [
  {
    id: "q1",
    pregunta: "¿Cuál es la capital de Francia?",
    opciones: ["Berlín", "Madrid", "París", "Lisboa"],
    respuesta_correcta: 2,
    pista_prompt: "Da una pista sobre la capital de Francia."
  },
  {
    id: "q2",
    pregunta: "¿Cuánto es 5 + 7?",
    opciones: ["10", "11", "12", "13"],
    respuesta_correcta: 2,
    pista_prompt: "Da una pista sobre la suma de 5 más 7."
  },
  {
    id: "q3",
    pregunta: "¿Quién escribió 'El Quijote'?",
    opciones: ["Lope de Vega", "Cervantes", "Quevedo", "Góngora"],
    respuesta_correcta: 1,
    pista_prompt: "Da una pista sobre el autor de 'El Quijote'."
  },
  {
    id: "q4",
    pregunta: "¿Cuál es el planeta más grande del Sistema Solar?",
    opciones: ["Marte", "Júpiter", "Saturno", "Neptuno"],
    respuesta_correcta: 1,
    pista_prompt: "Da una pista sobre el planeta más grande del Sistema Solar."
  },
];

const Game = () => {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [hint, setHint] = useState("");
  const [usedHint, setUsedHint] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
      return;
    }
    setQuestions(preguntas.map(q => ({ ...q, userAnswer: null, answered: false })));
  }, [navigate]);

  const fetchHint = async () => {
    if (usedHint[indice] || loadingHint) return;
    setLoadingHint(true);

    try {
      const question = preguntas[indice].pista_prompt;
      const model = "gemini";

      const response = await axios.post(`${apiEndpoint}/askllm`, { question, model, apiKey });
      setHint(response.data.answer);
      setUsedHint(prev => ({ ...prev, [indice]: true }));
    } catch (error) {
      console.error("Error obteniendo la pista:", error);
      setHint("No se pudo generar la pista. Inténtalo de nuevo más tarde.");
    }
    setLoadingHint(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[indice] = { ...updatedQuestions[indice], userAnswer: answerIndex, answered: true };
    setQuestions(updatedQuestions);
    if (answerIndex === preguntas[indice].respuesta_correcta) {
      setScore(score + 10);
    }
    setHint("");
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    }
  };

  if (!questions.length) {
    return <Container><Typography>Cargando...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 12, display: 'flex' }}>
      {hint && (
        <Box sx={{ width: 200, backgroundColor: '#ddd', padding: 2, marginRight: 2, borderRadius: 2 }}>
          <Typography variant="h6">Pista:</Typography>
          <Typography>{hint}</Typography>
          <Button variant="text" onClick={() => setHint("")}>Cerrar</Button>
        </Box>
      )}
      <Box sx={{ flexGrow: 1, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Pregunta {indice + 1} de {preguntas.length}
        </Typography>
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Typography variant="h6">Puntuación: {score}</Typography>
        </Box>
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
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {questions[indice].opciones.map((opcion, i) => (
              <Grid item xs={12} key={i}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => !questions[indice].answered && handleAnswerSelect(i)}
                  disabled={questions[indice].answered}
                >
                  {opcion}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Game;
