// webapp/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Paper, Grid, Button,
  Dialog, DialogTitle, DialogContent, List, ListItem, 
  ListItemText, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGame(null);
  };


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
                    {stats.totalPoints/10}
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
          <Typography variant="h5" gutterBottom sx={{
            fontWeight: 600,
            color: '#4e54c8',
            textAlign: 'center',
            mb: 3,
          }}>
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
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={() => handleGameClick(game)}
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
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            m: 0, 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="h6">
              Detalles del Juego - {selectedGame && new Date(selectedGame.createdAt).toLocaleDateString()}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedGame && (
              <List>
                {selectedGame.questions.map((q, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      backgroundColor: q.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      borderRadius: 1,
                      mb: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                      {/* Image section */}
                      {q.imageUrl && (
                        <Box sx={{ 
                          width: 150, 
                          height: 150, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: 1,
                          overflow: 'hidden',
                          bgcolor: 'background.paper'
                        }}>
                          <img 
                            src={q.imageUrl} 
                            alt="Pregunta"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                      )}
                      
                      {/* Question details section */}
                      <Box sx={{ flex: 1 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {q.question}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography 
                                variant="body2" 
                                color={q.correct ? "success.main" : "error.main"}
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                              >
                                {q.correct ? "✓ Correcta" : "✗ Incorrecta"}
                              </Typography>
                              <Typography variant="body2">
                                Tiempo: {Math.round(q.timeSpent)}s
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UserProfile;
