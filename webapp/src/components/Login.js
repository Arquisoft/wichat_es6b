import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const apiKey =  "AIzaSyCNEG2xtR3K1eoEYwMZYjUdxL9eoOEq50o" || 'None';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      if (apiKey === 'None') {
        setMessage("LLM API key is not set. Cannot contact the LLM.");
      } else {
        const question = `Please, generate a greeting message for a student called ${username} that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.`;
        const model = "gemini";

        const messageResponse = await axios.post(`${apiEndpoint}/askllm`, { question, model, apiKey });
        setMessage(messageResponse.data.answer);
      }

      setCreatedAt(response.data.createdAt);
      setLoginSuccess(true);
      setOpenSnackbar(true);
      
      // Guardar el nombre de usuario en localStorage
      localStorage.setItem('username', username);
      
      // Redirigir al perfil después de un breve retraso
      setTimeout(() => {
        navigate(`/profile/${username}`);
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: 15, backgroundColor: '#f0f0f0', borderRadius: 1, padding: 3 }}>
      {loginSuccess ? (
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            <Typewriter words={[message]} cursor cursorStyle="|" typeSpeed={50} />
          </Typography>
          <Typography component="p" variant="body1" sx={{ marginTop: 2, textAlign: 'center' }}>
            Your account was created on {new Date(createdAt).toLocaleDateString()}.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/ranking')}>
              Ver Rankings
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/game')}>
              Jugar
            </Button>
            <Button variant="outlined" onClick={() => navigate(`/profile/${username}`)}>
              Ver mi perfil
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography component="h1" variant="h5">Login</Typography>
          <TextField margin="normal" fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" color="primary" fullWidth onClick={loginUser}>Login</Button>

          <Snackbar 
            open={openSnackbar && !error} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar} 
            message="Login successful" 
          />
          
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar} 
            message={`Error: ${error}`} 
          />
        </Box>
      )}
    </Container>
  );
};

export default Login;