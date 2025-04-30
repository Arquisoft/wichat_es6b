import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  CircularProgress 
} from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const HomeRanking = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/rankings`);
        setRankings(response.data.slice(0, 5)); // Solo los top 5
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Jugador</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Puntos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankings.map((player, index) => (
              <TableRow key={player.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.username}</TableCell>
                <TableCell>{player.totalPoints}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        sx={{ mt: 2 }}
        onClick={() => navigate('/ranking')}
      >
        Ver Ranking Completo
      </Button>
    </>
  );
};

export default HomeRanking;