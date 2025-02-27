import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';

const preguntas = [
  {
    pregunta: "¿Cuál es la capital de Francia?",
    opciones: ["Berlín", "Madrid", "París", "Lisboa"],
    respuestaCorrecta: 2,
  },
  {
    pregunta: "¿Cuánto es 5 + 7?",
    opciones: ["10", "11", "12", "13"],
    respuestaCorrecta: 2,
  },
  {
    pregunta: "¿Quién escribió 'El Quijote'?",
    opciones: ["Lope de Vega", "Cervantes", "Quevedo", "Góngora"],
    respuestaCorrecta: 1,
  },
  {
    pregunta: "¿Cuál es el planeta más grande del Sistema Solar?",
    opciones: ["Marte", "Júpiter", "Saturno", "Neptuno"],
    respuestaCorrecta: 1,
  },
];

const Jugar = () => {
  const [indice, setIndice] = useState(0);

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

  return (
    <Container maxWidth="lg" sx={{ marginTop: 12, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Pregunta {indice + 1} de {preguntas.length}
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 2, position: "relative" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {preguntas[indice].pregunta}
        </Typography>

        <Button 
          variant="outlined" 
          color="warning" 
          sx={{ position: "absolute", top: 10, right: 10 }} 
        >
          Pedir Pista
        </Button>

        <Grid container spacing={7} sx={{ marginTop: 2, alignContent:'center' }}>
          {preguntas[indice].opciones.map((opcion, i) => (
            <Grid item xs={16} key={i}>
              <Button variant="contained" fullWidth sx={{ fontSize: "1rem", padding: 5 }}>
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
