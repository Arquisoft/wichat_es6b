// src/components/Groups.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Snackbar, List, ListItem, ListItemText } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000/api'; // Añadí /api como prefijo común

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true); // Estado para indicar carga

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiEndpoint}/groups`);
      setGroups(response.data); // Asumo que el backend devuelve directamente el array de grupos
      setLoading(false);
    } catch (err) {
      setError('Error fetching groups');
      console.error('Error fetching groups:', err);
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      setError('Group name cannot be empty');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${apiEndpoint}/groups`, { name: newGroupName }); // Simplifiqué la ruta
      const createdGroup = response.data; // Asumo que el backend devuelve el grupo creado directamente
      setGroups(prev => [...prev, createdGroup]);
      setSuccessMessage(`Group "${createdGroup.name}" created successfully! ID: ${createdGroup._id}`); // Asumo que MongoDB usa _id
      setNewGroupName('');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error creating group:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Error creating group');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h6" align="center">Loading groups...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          backgroundColor: 'rgba(245, 245, 240, 0.5)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Groups
        </Typography>

        <TextField
          fullWidth
          label="New Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={createGroup}
          sx={{
            backgroundColor: '#2575fc',
            color: 'white',
            fontWeight: 600,
            marginBottom: 4,
            '&:hover': {
              backgroundColor: '#4e54c8',
            },
          }}
        >
          Create Group
        </Button>

        <Typography variant="h6" gutterBottom>
          Existing Groups:
        </Typography>
        <List>
          {groups.map((group) => (
            <ListItem key={group._id}> {/* Asumo que MongoDB usa _id como identificador */}
              <ListItemText
                primary={group.name}
                secondary={`Group ID: ${group._id}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Snackbar
        open={openSnackbar && successMessage !== ''}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={`Error: ${error}`}
        />
      )}
    </Container>
  );
};

export default Groups;