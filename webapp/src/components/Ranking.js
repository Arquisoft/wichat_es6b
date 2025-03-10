import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const Ranking = () => {
  const navigate = useNavigate();

  const rankings = [
    { position: 1, name: "Jugador1", score: 9.8 },
    { position: 2, name: "Jugador2", score: 9.5 },
    { position: 3, name: "Jugador3", score: 9.3 },
    { position: 4, name: "Jugador4", score: 8.9 },
    { position: 5, name: "Jugador5", score: 8.5 },
  ];

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
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Nombre del Jugador</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>Puntuación /10</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map((player) => (
              <TableRow key={player.position}>
                <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>{player.position}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem" }}>{player.name}</TableCell>
                <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold", color: "#d32f2f" }}>{player.score}</TableCell>
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
