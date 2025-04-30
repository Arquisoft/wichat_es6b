import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, TextField, Button, Snackbar, Box, Tabs, Tab } from '@mui/material';
import { SessionContext } from '../context/SessionContext';

const Login = () => {
  const [tabValue, setTabValue] = useState(0); // 0 para Login, 1 para Signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [ loginSuccess,setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');

  const { createSession } = useContext(SessionContext);
  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const apiKey = process.env.REACT_APP_LLM_API_KEY || 'None';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Limpiar campos al cambiar de pestaña
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const loginUser = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please complete all fields.');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      if (apiKey === 'None') {
        var aux = setCreatedAt; 
        var auxiliar = loginSuccess
        setMessage("LLM API key is not set. Cannot contact the LLM."+aux+auxiliar);
      } else {
        const question = `Please, generate a greeting message for a student called ${username} that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.`;
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
      createSession(username);
      navigate('/dashboard'); // Redirigir al dashboard después del login exitoso
      
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
      setOpenSnackbar(true);
    }
  };

  const signupUser = async () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please complete all fields.');
      setOpenSnackbar(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setOpenSnackbar(true);
      return;
    }
    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    if (password.length < 4){
      setError('The password length cannot be less than 4 characters');
    }

    if (password.length >= 20){
      setError('The password cannot have more than 20 characters');
    }

    if (username.length < 3){
      setError('The username length cannot be less than 3 characters');
    }

    if (username.length >= 20){
      setError('The username cannot have more than 20 characters');
    }
  
    try {
      console.log(username)
      console.log(password)
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      
      setOpenSnackbar(true);
      setMessage('Registration successful! Please log in.');
      setError(''); 
      
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Error al registrarse');
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
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: 'rgba(245, 245, 240, 0.5)',
        padding: '2rem',
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
      <Box sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#6a11cb',
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#4e54c8',
              fontWeight: 600,
            }
          }}
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        {tabValue === 0 ? (
          // Login Form
          <>
            <Typography component="h1" variant="h5"  data-testid="login-title" sx={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600, }}>
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
              data-testid="login-button"
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
          </>
        ) : (
          // Signup Form
          <>
            <Typography component="h1" variant="h5" data-testid="signup-title" sx={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
              Signup
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
            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              data-testid="signup-button"
              onClick={signupUser}
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
              Signup
            </Button>
          </>
        )}
  
        <Snackbar
          open={openSnackbar && message && !error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message || "Login successful"}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={`Error: ${error}`}
        />
      </Box>
    </Box>
  );
};

export default Login;