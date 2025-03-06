import React, { useEffect, useState } from 'react';
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
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Wikidata test page for Wichat6b
      </Typography>
    </Container>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [items, setItems] = useState([]);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };
  useEffect(() => {
    fetch('http://localhost:8003/api/items') // Llama a tu API
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

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
          <div>
            <h2>Objetos en la base de datos:</h2>
            <ul>
              {items.map(item => (
                <li key={item._id}>{item.nombre}: {item.descripcion}</li>
              ))}
            </ul>
          </div>
        </Container>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
