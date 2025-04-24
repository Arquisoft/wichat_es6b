import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import FlipCard from './components/FlipCard';
import Game from './game/gameManager';
import Ranking from './components/Ranking';
import UserProfile from './components/UserProfile';
import Settings from './components/GameSettings';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Router>
        <>
          <NavBar />

          {/* Animated Background */}
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

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pt: '10vh',
              pb: '10vh',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>

          <Footer />
        </>
      </Router>
    </Box>
  );
}

export default App;
