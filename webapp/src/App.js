import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typewriter } from "react-simple-typewriter";
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Grid, List, ListItem, ListItemIcon, ListItemText, Button, Paper } from '@mui/material';
import FlipCard from './components/FlipCard';
import { SessionContext } from './context/SessionContext';
import { SessionProvider } from './context/SessionContext';
import Game from './game/gameManager';
import Ranking from './components/Ranking';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer'; 
import NavBar from './components/NavBar'; 
import HomeRanking from './components/HomeRanking';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GameSettings from './components/GameSettings';
import AvatarSelection from './components/AvatarSelection';

import './App.css';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(SessionContext);

  const handlePlayClick = () => {
    if (isLoggedIn) {
      navigate('/game');
    } else {
      navigate('/login');
    }
  };
 


  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Sección de Bienvenida */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Bienvenido a WiChat
            </Typography>
            <Typography variant="h5">
              El juego de preguntas donde aprenderás mientras te diviertes
            </Typography>
          </Paper>
        </Grid>

        {/* Sección de Instrucciones */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2575fc', fontWeight: 'bold' }}>
              ¿Cómo Jugar?
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon sx={{ color: '#6a11cb' }}/>
                </ListItemIcon>
                <ListItemText 
                  primary="1. Regístrate o Inicia Sesión" 
                  secondary="Crea tu cuenta para empezar a jugar y guardar tu progreso"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <QuizIcon sx={{ color: '#6a11cb' }}/>
                </ListItemIcon>
                <ListItemText 
                  primary="2. Responde Preguntas" 
                  secondary="Tendrás 30 segundos para responder cada pregunta"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ChatIcon sx={{ color: '#6a11cb' }}/>
                </ListItemIcon>
                <ListItemText 
                  primary="3. Usa el Chat de IA" 
                  secondary="Pide pistas a la IA para ayudarte con las respuestas"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEventsIcon sx={{ color: '#6a11cb' }}/>
                </ListItemIcon>
                <ListItemText 
                  primary="4. Gana Puntos" 
                  secondary="Cada respuesta correcta suma 10 puntos a tu marcador"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Sección de Ranking */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#2575fc', fontWeight: 'bold' }}>
              Top Jugadores
            </Typography>
            <HomeRanking />
          </Paper>
        </Grid>

        {/* Botón de Comenzar */}
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            data-testid="start-button"
            sx={{
              backgroundColor: '#6a11cb',
              '&:hover': {
                backgroundColor: '#4e54c8',
              },
              py: 2,
              px: 6,
              fontSize: '1.2rem'
            }}
            onClick={handlePlayClick}
          >
            {isLoggedIn ? '¡Comenzar a Jugar!' : '¡Iniciar Sesión!'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
 export { Home };

function App() {
  return (
    <SessionProvider>
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
    <Router>
      <>
      {/* Barra de navegación */}
       <NavBar />
        {/* Fondo animado mejorado */}
        <motion.div
          tabIndex={-1}
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: -1,
            background: "linear-gradient(270deg, #6a11cb, #2575fc, #a239ea, #4e54c8)",
            backgroundSize: "400% 400%",
          }}
        />
        
        {/* Main content container - añade espacio para el header */}
        <Box
            sx={{
              flexGrow: 1,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(90vh - 64px)', // 90vh menos la altura del NavBar
              overflow: 'hidden',
              '@media (max-width: 768px)': {
                height: 'calc(90vh - 56px)', // En móvil el NavBar es más pequeño
              }
            }}
          >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/game" element={<Game />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/settings" element={<GameSettings />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/profile/edit" element={<AvatarSelection />} />
              </Routes>
          </Box>
          <Footer/>
      </>
    </Router>
    </Box>
    </SessionProvider>

  );
}

export default App;
