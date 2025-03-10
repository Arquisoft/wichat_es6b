import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import Game from './game'; // Importa la clase Game

const Jugar = () => {
  const [game] = useState(new Game());
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [puntaje, setPuntaje] = useState(0);

  useEffect(() => {
    const cargarPreguntas = async () => {
      setLoading(true);
      const fetchedQuestions = await game.fetchQuestions();
      if (fetchedQuestions) {
        setPreguntas(fetchedQuestions);
      }
      setLoading(false);
    };
    cargarPreguntas();
  }, []);

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

  const handleAnswer = (opcion) => {
    if (game.checkAnswer(indice, opcion)) {
      setPuntaje(game.getTotalScore());
    }
    handleSiguiente();
  };

  if (loading) {
    return <Typography variant="h5" align="center">Cargando preguntas...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 12, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Pregunta {indice + 1} de {preguntas.length}
      </Typography>
      <Typography variant="h6" align="center">Puntaje: {puntaje}</Typography>

      <Paper sx={{ padding: 3, marginBottom: 2, position: "relative" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {preguntas[indice].responseQuestion}
        </Typography>
        
        {preguntas[indice].responseImage && (
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={preguntas[indice].responseImage} alt="Pregunta" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </Box>
        )}

        <Grid container spacing={2} sx={{ marginTop: 2, alignContent: 'center' }}>
          {preguntas[indice].responseOptions.map((opcion, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ fontSize: "1rem", padding: 2 }}
                onClick={() => handleAnswer(opcion)}
              >
                {opcion}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleAnterior} 
          disabled={indice === 0}
        >
          Anterior Pregunta
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSiguiente} 
          disabled={indice === preguntas.length - 1}
        >
          Siguiente Pregunta
        </Button>
      </Box>
    </Container>
  );
};

export default Jugar;
