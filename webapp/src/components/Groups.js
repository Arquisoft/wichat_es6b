import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import './groups.css'; // Reutilizamos el CSS para mantener la apariencia

const Groups = () => {
  const [groupId, setGroupId] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((event) => {
    setGroupId(event.target.value);
  }, []);

  const handleJoinGroup = useCallback(async () => {
    setError('');
    setMembers([]);
    setLoading(true);

    if (!groupId.trim()) {
      setError('Por favor, introduce un ID de grupo.');
      setLoading(false);
      return;
    }

    // Simulación de una llamada a la API (reemplaza con tu lógica real)
    setTimeout(() => {
      const fakeMembers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      setMembers(fakeMembers);
      setLoading(false);
    }, 1500);

    // Aquí iría tu llamada real a la API para obtener los miembros del grupo
    // try {
    //   const response = await fetch(`/api/groups/${groupId}/members`);
    //   const data = await response.json();
    //   if (response.ok) {
    //     setMembers(data.members);
    //   } else {
    //     setError(data.message || 'Error al unirse al grupo.');
    //   }
    // } catch (error) {
    //   setError('Hubo un problema al conectar con el servidor.');
    //   console.error('Error:', error);
    // } finally {
    //   setLoading(false);
    // }
  }, [groupId]);

  const handleGoBack = useCallback(() => {
    navigate(-1); // Volver a la página anterior
  }, [navigate]);

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
          Unirse a un Grupo
        </Typography>

        <TextField
          label="ID del grupo"
          variant="outlined"
          fullWidth
          value={groupId}
          onChange={handleInputChange}
          sx={{ marginBottom: '1rem' }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleJoinGroup}
          fullWidth
          disabled={loading}
          sx={{ marginTop: '1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Unirse'}
        </Button>

        {error && (
          <Typography color="error" sx={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}

        {members.length > 0 && (
          <Box sx={{ marginTop: '2rem' }}>
            <Typography variant="h6" gutterBottom align="left">
              Miembros del Grupo:
            </Typography>
            <List>
              {members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText primary={member.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Button variant="outlined" onClick={handleGoBack} fullWidth sx={{ marginTop: '2rem' }}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default Groups;