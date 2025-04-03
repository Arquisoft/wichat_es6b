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
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            color: '#333',
            mb: 4,
          }}
        >
          Perfil de {username}
        </Typography>
  
        {stats && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#4e54c8',
                textAlign: 'center',
                mb: 3,
              }}
            >
              Estadísticas Generales
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Partidas Jugadas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2575fc' }}>
                    {stats.totalGames}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Puntos Totales
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2575fc' }}>
                    {stats.totalPoints}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Respuestas Correctas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2575fc' }}>
                    {stats.correctAnswers}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Tiempo Promedio
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2575fc' }}>
                    {Math.round(stats.averageTime)}s
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
  
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#4e54c8',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Historial de Juegos
          </Typography>
          {gameHistory.length > 0 ? (
            <Grid container spacing={2}>
              {gameHistory.map((game, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#ffffff',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Fecha:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(game.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Puntos:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {game.points}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Tiempo promedio:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {Math.round(game.avgtime)}s
                        </Typography>
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
            sx={{
              backgroundColor: '#2575fc',
              '&:hover': {
                backgroundColor: '#4e54c8',
              },
            }}
            onClick={() => navigate('/game')}
          >
            Jugar Nueva Partida
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              backgroundColor: '#6a11cb',
              '&:hover': {
                backgroundColor: '#4e54c8',
              },
            }}
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
