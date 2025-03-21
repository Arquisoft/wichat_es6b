import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Typewriter } from "react-simple-typewriter";

import AddUser from './components/AddUser';
// Importante: Importamos el componente Login original para mantener su funcionalidad
import Login from './components/Login';
import Game from './game/gameManager';
import Ranking from './components/Ranking';
import UserProfile from './components/UserProfile';
import './App.css';

function StyledLogin() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ 
        width: '100%',
        backgroundColor: 'rgba(245, 245, 240, 0.5)',
        padding: '1.5rem',
        borderRadius: '12px',
        '& .MuiTypography-h5': {
          marginBottom: '1.5rem',
          fontWeight: 600,
          color: '#333',
          textAlign: 'center'
        },
        '& .MuiTextField-root': {
          marginBottom: '1rem',
          '&:last-of-type': {
            marginBottom: '1.5rem'
          }
        },
        '& .MuiInputBase-root': {
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover fieldset': {
            borderColor: '#4e54c8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6a11cb',
            borderWidth: '2px',
          },
        },
        '& .MuiButton-contained': {
          backgroundColor: '#2575fc',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '1rem',
          letterSpacing: '0.5px',
          height: '50px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(37, 117, 252, 0.2)',
          '&:hover': {
            backgroundColor: '#4e54c8',
            boxShadow: '0 6px 16px rgba(37, 117, 252, 0.3)',
            transform: 'translateY(-2px)'
          }
        }
      }}>
        <Login />
      </Box>
    </Box>
  );
}

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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: {
          xs: '2rem',
          sm: '2.5rem'
        },
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginTop: '10vh',
        transition: 'all 0.3s ease-in-out',
        width: {
          xs: '90%',
          sm: '500px'
        },
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-5px)'
        }
      }}
    >
      <CssBaseline />
      {/* Usamos el Login estilizado o el AddUser original */}
      {showLogin ? <StyledLogin /> : <AddUser />}
      
      <Typography 
        component="div" 
        align="center" 
        sx={{ 
          marginTop: 2, 
          fontSize: '1rem',
          fontWeight: 500
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