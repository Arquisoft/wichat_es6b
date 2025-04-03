// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8001';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
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
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
      setError('');
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Mostrar el mensaje de error del backend
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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
        }
      }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <TextField
          name="username"
          margin="normal"
          required
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          name="password"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={addUser}
          fullWidth
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
              transform: 'translateY(-2px)'
            }
          }}
        >
          Register
        </Button>
      </Box>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        message="User added successfully" 
      />
      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')} 
          message={`Error: ${error}`} 
        />
      )}
    </Box>
  );
};

export default AddUser;