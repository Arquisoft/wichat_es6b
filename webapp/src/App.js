import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Typewriter } from "react-simple-typewriter";
import axios from "axios";


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

  const [data, setData] = useState(null); // Estado para almacenar la respuesta
  const [loading, setLoading] = useState(true); // Estado para manejar el cargado
  const [error, setError] = useState(null); // Estado para manejar errores

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      // Cambia la URL del backend por la correcta si es necesario
      const response = await axios.get("http://localhost:8003/generateQuestion?language=es&thematic=Geografia");
      if (!response.ok) {
        throw new Error('Error en la llamada a la API');
      }
      const result = await response.json();
      setData(result);

    } catch (error) {
      console.error("Error fetching the question:", error);
    }finally {
      setLoading(false); // Cambiamos el estado de loading a false
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No hay datos disponibles</p>;

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
            <pre>{JSON.stringify(data, null, 2)}</pre>
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
