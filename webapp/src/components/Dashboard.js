import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import { SessionContext } from '../context/SessionContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { username: contextUsername } = useContext(SessionContext);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [createdAt] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const apiKey = process.env.REACT_APP_LLM_API_KEY || 'None';

  const username = contextUsername || localStorage.getItem('username');


  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setIsLoading(true);
      try {
        if (apiKey === 'None') {
          setWelcomeMessage("LLM API key is not set. Cannot contact the LLM.");
        } else {
          const question = `Please, generate a greeting message for a student called ${username} that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.`;
          const model = "gemini";
          const context = "Generate the response in Spanish"; 
          const messageResponse = await axios.post(`${apiEndpoint}/askllm`, { 
            question, 
            model, 
            apiKey, 
            context 
          });
          setWelcomeMessage(messageResponse.data.answer);
        }
      } catch (error) {
        console.error('Error fetching welcome message:', error);
        setWelcomeMessage('¡Bienvenido de nuevo!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWelcomeMessage();
  }, [username, apiKey, apiEndpoint]);

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'rgba(245, 245, 240, 0.5)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    }}>
      <Box>
    
        <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginBottom: 2 }}>
          {isLoading ? (
            "Cargando mensaje de bienvenida..."
          ) : (
            <Typewriter 
              words={[welcomeMessage]} 
              cursor 
              cursorStyle="|" 
              typeSpeed={50} 
            />
          )}
        </Typography>

        {createdAt && (
          <Typography component="p" variant="body2" sx={{ textAlign: 'center', marginBottom: 3, color: 'text.secondary' }}>
            Tu cuenta fue creada el {new Date(createdAt).toLocaleDateString()}.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/game')}
            sx={{
              backgroundColor: '#2575fc',
              '&:hover': { backgroundColor: '#4e54c8' }
            }}
          >
            Jugar
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/ranking')}
            sx={{
              backgroundColor: '#6a11cb',
              '&:hover': { backgroundColor: '#4e54c8' }
            }}
          >
            Ver Rankings
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/profile/${username}`)}
            sx={{
              borderColor: '#6a11cb',
              color: '#6a11cb',
              '&:hover': {
                borderColor: '#4e54c8',
                color: '#4e54c8'
              }
            }}
          >
            Ver mi perfil
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;