// webapp/src/components/Settings.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import './difficulty-selector.css'; // Importa el nuevo archivo CSS

const difficultyOptions = [
  { name: 'Fácil', time: 42 },
  { name: 'Medio', time: 32 },
  { name: 'Difícil', time: 22 },
];

const categoryOptions = ["Geografia", "Cultura", "Futbolistas", "Pintores", "Cantantes"];

const Settings = () => {
  const [difficulty, setDifficulty] = useState('Fácil');
  const [selectedCategories, setSelectedCategories] = useState(categoryOptions); // Por defecto, todas seleccionadas
  const navigate = useNavigate();

  const handleDifficultyChange = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const selectedOption = difficultyOptions.find(opt => opt.name === selectedDifficulty);
    if (selectedOption) {
      console.log(`Dificultad seleccionada: ${selectedOption.name} (${selectedOption.time} segundos)`);
      localStorage.setItem('gameDifficulty', selectedDifficulty); // Guarda la dificultad en localStorage al cambiar
    }
  }, []);

  const handleCategoryToggle = useCallback((category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        // Si ya está seleccionada, la quitamos
        return prevSelected.filter((cat) => cat !== category);
      } else {
        // Si no está seleccionada, la añadimos
        return [...prevSelected, category];
      }
    });
  }, []);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSaveAndPlay = () => {
    localStorage.setItem('gameDifficulty', difficulty); // Asegura que la dificultad actual se guarde
    localStorage.setItem('selectedCategories', selectedCategories); // Guarda las categorías seleccionadas
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
          <button
            key={option.name}
            className={`option ${option.name.toLowerCase()} ${difficulty === option.name ? 'active' : ''}`}
            onClick={() => handleDifficultyChange(option.name)}
            type="button"
          >
            {option.name}
          </button>
        ))}
        </div>

        <Typography variant="h6" gutterBottom align="left" style={{ marginTop: '2rem' }}>
          Categorías:
        </Typography>

        <div className="selector">
        {categoryOptions.map((category) => (
          <button
            key={category}
            className={`option ${selectedCategories.includes(category) ? 'active' : ''}`}
            onClick={() => handleCategoryToggle(category)}
            type="button"
          >
            {category}
          </button>
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