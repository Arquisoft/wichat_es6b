import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Typewriter } from "react-simple-typewriter";
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
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: -1,
            background: "linear-gradient(270deg, #6a11cb, #2575fc, #a239ea, #4e54c8)",
            backgroundSize: "400% 400%",
          }}
        />
        
        {/* Header mejorado */}
        {/* <Container 
          component="header" 
        
          maxWidth={false} 
          sx={{
            background: 'linear-gradient(90deg, #2c3e50 0%, #4e54c8 100%)',
            margin: 0,
            height: "10vh",
            position: "fixed",
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
            padding: '0 2rem'
          
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.5px'
            }}
          >
            <Typewriter 
              words={["Welcome to the 2025 edition of the Wichat game"]} 
              cursor 
              cursorStyle="|" 
              typeSpeed={70}
            />
          </Typography>
        </Container> */}
        
        {/* Main content container - añade espacio para el header */}
        <Box
            sx={{
              flexGrow: 1, // Hace que el contenido se expanda para llenar el espacio
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pt: '10vh', // Espacio para el NavBar fijo
              pb: '10vh', // Opcional para dejar espacio para un futuro footer
            }}
          >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/game" element={<Game />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/profile/:username" element={<UserProfile />} />
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