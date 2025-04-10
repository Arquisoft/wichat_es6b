// webapp/src/components/Settings.js
import React, { useState } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Settings = () => {
  const [difficulty, setDifficulty] = useState('medio'); // Estado para la dificultad

  const handleChangeDifficulty = (event) => {
    setDifficulty(event.target.value);
    // Aquí podrías implementar la lógica para aplicar la dificultad
    console.log(`Dificultad seleccionada: ${event.target.value}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom align="center">
        Configuraciones
      </Typography>
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="difficulty-label">Dificultad</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty"
            value={difficulty}
            label="Dificultad"
            onChange={handleChangeDifficulty}
          >
            <MenuItem value="facil">Fácil</MenuItem>
            <MenuItem value="medio">Medio</MenuItem>
            <MenuItem value="dificil">Difícil</MenuItem>
          </Select>
        </FormControl>
        {/* Aquí podrías añadir más opciones de configuración */}
      </Box>
    </Container>
  );
};

export default Settings;