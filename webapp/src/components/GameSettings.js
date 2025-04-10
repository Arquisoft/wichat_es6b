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
      // Aquí implementarías la lógica para aplicar la dificultad y el tiempo
    }
  }, []);

  const handleGoBack = () => {
    navigate('/');
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
          '& .go-back-button': {
            marginTop: '2rem',
            backgroundColor: '#6c757d',
            color: 'white',
            '&:hover': {
              backgroundColor: '#5a6268',
            },
          },
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Configuraciones
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

        <Button variant="contained" onClick={handleGoBack} className="go-back-button">
          Volver atrás
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;