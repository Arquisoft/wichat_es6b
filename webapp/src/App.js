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
import Footer from './components/Footer'; 
import NavBar from './components/NavBar'; 
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
              flexGrow: 1, // Hace que el contenido se expanda para llenar el espacio
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pt: '10vh', // Espacio para el NavBar 
              pb: '10vh',  //Espacio para el footer
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
      </>
    </Router>
    </Box>
  );
}

export default App;