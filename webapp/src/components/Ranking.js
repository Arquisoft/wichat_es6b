import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, CircularProgress } from '@mui/material';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const EfficiencyCircle = ({ value }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={60}
        thickness={4}
        sx={{
          color: (theme) => 
            value < 30 ? theme.palette.error.main :
            value < 70 ? theme.palette.warning.main :
            theme.palette.success.main
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const Ranking = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/rankings`); 
        setRankings(response.data); // Asume que el backend devuelve un array de usuarios ordenados por puntos
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el ranking');
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <Typography align="center">Cargando ranking...</Typography>;
  }

  if (error) {
    return <Typography align="center" color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 12, backgroundColor: '#f0f0f0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Ranking de Jugadores
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#33779d" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Jugador</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Puntos</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Partidas Jugadas</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Eficiencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map((player, index) => (
              <TableRow key={player.username}>
                <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{player.username}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold", color: "#d32f2f" }}>
                  {player.totalPoints}
                </TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{player.totalGames}</TableCell>
                <TableCell>
                  <EfficiencyCircle value={player.efficiency} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        variant="contained" 
        color="secondary" 
        sx={{ display: "block", margin: "30px auto", padding: "10px 20px", fontSize: "1rem" }} 
        onClick={() => navigate(-1)}
      >
        Volver Atrás
      </Button>
    </Container>
  );
};

export default Ranking;