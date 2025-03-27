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

        const question = `Please, generate a greeting message for a student called adolf that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.`;
        const model = "gemini";
        const context = "Generate the response in Spanish"; 
        const messageResponse = await axios.post(`${apiEndpoint}/askllm`, { question, model, apiKey, context });
        setMessage(messageResponse.data.answer);
      }

      setCreatedAt(response.data.createdAt);
      setLoginSuccess(true);
      setOpenSnackbar(true);
      
      // Guardar el nombre de usuario en localStorage
      localStorage.setItem('username', username);
      
      
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
    <Box
    sx={{
      width: '100%',
      backgroundColor: 'rgba(245, 245, 240, 0.5)',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      '& .MuiTypography-h5': {
        marginBottom: '1.5rem',
        fontWeight: 600,
        color: '#333',
        textAlign: 'center',
      },
      '& .MuiTextField-root': {
        marginBottom: '1rem',
        '&:last-of-type': {
          marginBottom: '1.5rem',
        },
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
    }}
  >
    {loginSuccess ? (
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          <Typewriter words={[message]} cursor cursorStyle="|" typeSpeed={50} />
        </Typography>
        <Typography component="p" variant="body1" sx={{ marginTop: 2, textAlign: 'center' }}>
          Your account was created on {new Date(createdAt).toLocaleDateString()}.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
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
      <Box sx={{ width: '100%' }}>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={loginUser}
          sx={{
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
              transform: 'translateY(-2px)',
            },
          }}
        >
          Login
        </Button>

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
  </Box>
  );
};

export default Login;