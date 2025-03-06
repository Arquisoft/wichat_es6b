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


function Home() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Wikidata test page for Wichat6b
      </Typography>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
            Don't have an account? Register here.
          </Link>
        ) : (
          <Link component="button" variant="body2" onClick={handleToggleView}>
            Already have an account? Login here.
          </Link>
        )}
      </Typography>
    </Container>
  );
}

function App() {

  
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <>
        <Container component="header" maxWidth={false} 
          sx={{
            backgroundColor: "#FFFDD0",
            margin: 0,
            height: "5vh",
            position: "absolute",
            top: 0,
            left: 0,
            paddingBottom: 10,
          }}
        >
          <Typography component="h3" variant="h4" align="center" sx={{ marginTop: 2 }}>
            <Typewriter words={["Wikidata trial page for wichat6b tests"]} cursor cursorStyle="|" typeSpeed={50} />
          </Typography>
        </Container>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
