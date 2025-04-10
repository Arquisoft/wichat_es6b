// webapp/src/components/Settings.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import './difficulty-selector.css'; // Importa el nuevo archivo CSS

const difficultyOptions = [
  { name: 'Fácil', time: 40 },
  { name: 'Medio', time: 30 },
  { name: 'Difícil', time: 20 },
];

const Settings = () => {
  const [difficulty, setDifficulty] = useState('Fácil');
  const navigate = useNavigate();

  const handleDifficultyChange = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const selectedOption = difficultyOptions.find(opt => opt.name === selectedDifficulty);
    if (selectedOption) {
      console.log(`Dificultad seleccionada: ${selectedOption.name} (${selectedOption.time} segundos)`);
      localStorage.setItem('gameDifficulty', selectedDifficulty); // Guarda la dificultad en localStorage al cambiar
    }
  }, []);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSaveAndPlay = () => {
    localStorage.setItem('gameDifficulty', difficulty); // Asegura que la dificultad actual se guarde
    navigate('/game');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        mt: 10,
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '400px',
          backgroundColor: 'rgba(245, 245, 240, 0.5)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          '& .MuiTypography-h4': {
            marginBottom: '2rem',
            fontWeight: 600,
            color: '#333',
            textAlign: 'center',
          },
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Configuraciones
        </Typography>

        <Typography variant="h6" gutterBottom align="left">
          Nivel de dificultad:
        </Typography>

        <div className="selector">
          {difficultyOptions.map((option) => (
            <div
              key={option.name}
              className={`option ${option.name.toLowerCase()} ${difficulty === option.name ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(option.name)}
            >
              {option.name}
            </div>
          ))}
        </div>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
          }}
        >
          <Button variant="contained" onClick={handleGoBack} className="go-back-button">
            Guardar y salir
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSaveAndPlay}>
            Guardar y jugar
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default Settings;