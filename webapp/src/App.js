import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Typewriter } from "react-simple-typewriter";

import FlipCard from './components/FlipCard';
import Game from './game/gameManager';
import Ranking from './components/Ranking';
import UserProfile from './components/UserProfile';
<<<<<<< HEAD
import FlipCard from './components/FlipCard';
import Settings from './components/GameSettings';
=======
import Footer from './components/Footer'; 
import NavBar from './components/NavBar'; 
>>>>>>> 0258e4d71eeec090f372c81aaef5b03c6fcc5a9a
import './App.css';


function Home() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        marginTop: '10vh',
      }}
    >
      <CssBaseline />
      <FlipCard />
    </Container>
  );
}


function App() {
  return (
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
<<<<<<< HEAD
        <Container 
          maxWidth={false}
          sx={{
            padding: '2rem',
            minHeight: '100vh',
            paddingTop: '12vh', // Espacio para el header
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
=======
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
                <Route path="/game" element={<Game />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/profile/:username" element={<UserProfile />} />
              </Routes>
          </Box>
          <Footer/>
>>>>>>> 0258e4d71eeec090f372c81aaef5b03c6fcc5a9a
      </>
    </Router>
    </Box>
  );
}

export default App;