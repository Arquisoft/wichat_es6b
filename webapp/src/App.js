import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Typewriter } from "react-simple-typewriter";

import AddUser from './components/AddUser';
import Login from './components/Login';
import Game from './game/gameManager';
import Ranking from './components/Ranking';
import UserProfile from './components/UserProfile';
import './App.css';

function Home() {
  const [showLogin, setShowLogin] = useState(true);
  
  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };
  
  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '16px',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginTop: '15vh',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-5px)'
        }
      }}
    >
      <CssBaseline />
      {showLogin ? <Login /> : <AddUser />}
      
      <Typography 
        component="div" 
        align="center" 
        sx={{ 
          marginTop: 3, 
          fontSize: '0.95rem',
          transition: 'all 0.2s ease'
        }}
      >
        {showLogin ? (
          <Link 
            component="button" 
            variant="body2" 
            onClick={handleToggleView} 
            sx={{ 
              color: '#6a11cb',
              textDecoration: 'none',
              fontWeight: 500,
              position: 'relative',
              '&:hover': {
                color: '#8a3ffc',
                '&::after': {
                  width: '100%'
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: 0,
                height: '2px',
                backgroundColor: '#8a3ffc',
                transition: 'width 0.3s ease'
              }
            }}
          >
            Don't have an account? Register here.
          </Link>
        ) : (
          <Link 
            component="button" 
            variant="body2" 
            onClick={handleToggleView} 
            sx={{ 
              color: '#6a11cb',
              textDecoration: 'none',
              fontWeight: 500,
              position: 'relative',
              '&:hover': {
                color: '#8a3ffc',
                '&::after': {
                  width: '100%'
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: 0,
                height: '2px',
                backgroundColor: '#8a3ffc',
                transition: 'width 0.3s ease'
              }
            }}
          >
            Already have an account? Login here.
          </Link>
        )}
      </Typography>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <>
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
        <Container 
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
        </Container>
        
        {/* Main content container - añade espacio para el header */}
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
          </Routes>
        </Container>
      </>
    </Router>
  );
}

export default App;