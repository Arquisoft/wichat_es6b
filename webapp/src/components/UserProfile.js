// webapp/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verificar si el usuario está autenticado
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername || storedUsername !== username) {
          navigate('/');
          return;
        }

        // Cargar estadísticas y historial
        const [statsResponse, historyResponse] = await Promise.all([
          axios.get(`${apiEndpoint}/stats/${username}`),
          axios.get(`${apiEndpoint}/history/${username}`)
        ]);

        setStats(statsResponse.data);
        setGameHistory(historyResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, navigate]);

  if (loading) {
    return (
      <Container>
        <Typography>Cargando perfil...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom>
          Perfil de {username}
        </Typography>

        {stats && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Estadísticas Generales</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Partidas Jugadas</Typography>
                  <Typography variant="h4">{stats.totalGames}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Puntos Totales</Typography>
                  <Typography variant="h4">{stats.totalPoints}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Respuestas Correctas</Typography>
                  <Typography variant="h4">{stats.correctAnswers}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Tiempo Promedio</Typography>
                  <Typography variant="h4">{Math.round(stats.averageTime)}s</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>Historial de Juegos</Typography>
          {gameHistory.length > 0 ? (
            <Grid container spacing={2}>
              {gameHistory.map((game, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography>Fecha: {new Date(game.createdAt).toLocaleDateString()}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography>Puntos: {game.points}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography>Tiempo promedio: {Math.round(game.avgtime)}s</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No hay juegos registrados aún.</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/game')}
          >
            Jugar Nueva Partida
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/ranking')}
          >
            Ver Rankings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
