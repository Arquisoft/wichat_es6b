// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const apiKey = process.env.REACT_APP_LLM_API_KEY || 'None';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      const question = "Please, generate a greeting message for a student called " + username + " that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.";
      const model = "empathy"

      if (apiKey==='None'){
        setMessage("LLM API key is not set. Cannot contact the LLM.");
      }
      else{
        const message = await axios.post(`${apiEndpoint}/askllm`, { question, model, apiKey })
        setMessage(message.data.answer);
      }
      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" 
    
    sx={{ 
      marginTop: 15, 
      backgroundColor: '#f0f0f0' , 
      borderRadius : 1, 
      padding: 3,
      border: "1px solid black" 
      
    }}>
      {loginSuccess ? (
      <Box>
      <Typewriter
        words={[message]} 
        cursor
        cursorStyle="|"
        typeSpeed={50} 
      />
      <Typography component="p" variant="body1" sx={{ marginTop: 2, textAlign:'center'}}>
        Your account was created on {new Date(createdAt).toLocaleDateString()}.
      </Typography>
      
      {/* Menú con las dos opciones */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={() => console.log("Ver Ranking")}>
          Ver Rankinges
        </Button>
        <Button variant="contained" color="secondary" onClick={() => console.log("Jugar")}>
          Jugar
        </Button>
      </Box>
      </Box>
      ) : (
      // Formulario de Login
      <Box>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth onClick={loginUser}>
        Login
      </Button>

      {/* Notificaciones */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
      </Box>
            )}
    </Container>
  );
};

export default Login;
