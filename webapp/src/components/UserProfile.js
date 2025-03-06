// webapp/src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Paper, Grid, 
  List, ListItem, ListItemText, Divider, 
  CircularProgress, Button, Accordion, 
  AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas del usuario
        const statsResponse = await axios.get(`${apiEndpoint}/stats/${username}`);
        setStats(statsResponse.data);
        
        // Obtener historial de juegos
        const historyResponse = await axios.get(`${apiEndpoint}/history/${username}`);
        setGameHistory(historyResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Error loading user data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 10, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          User Profile: {username}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Estadísticas del usuario */}
        <Typography variant="h5" gutterBottom>
          Game Statistics
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="h6">Total Games</Typography>
              <Typography variant="h3">{stats?.totalGames || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
              <Typography variant="h6">Correct Answers</Typography>
              <Typography variant="h3">{stats?.correctAnswers || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
              <Typography variant="h6">Wrong Answers</Typography>
              <Typography variant="h3">{stats?.wrongAnswers || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff8e1' }}>
              <Typography variant="h6">Total Points</Typography>
              <Typography variant="h3">{stats?.totalPoints || 0}</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
              <Typography variant="h6">Average Time</Typography>
              <Typography variant="h3">{stats?.averageTime ? `${stats.averageTime.toFixed(1)}s` : '0s'}</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Historial de juegos */}
        <Typography variant="h5" gutterBottom>
          Game History
        </Typography>
        
        {gameHistory.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No games played yet.
          </Typography>
        ) : (
          <List>
            {gameHistory.map((game) => (
              <Accordion key={game.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container alignItems="center">
                    <Grid item xs={4}>
                      <Typography variant="subtitle1">
                        {format(new Date(game.createdAt), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={`${game.points} points`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        Time: {game.avgtime.toFixed(1)}s
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  {game.questions && game.questions.length > 0 ? (
                    <List dense>
                      {game.questions.map((q, index) => (
                        <ListItem key={index} sx={{ 
                          bgcolor: q.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          borderRadius: 1,
                          mb: 1
                        }}>
                          <ListItemText
                            primary={q.question}
                            secondary={`Time: ${q.timeSpent.toFixed(1)}s • ${q.correct ? 'Correct' : 'Incorrect'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No detailed question data available for this game.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        )}
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/game')}
            sx={{ mr: 2 }}
          >
            Play New Game
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
