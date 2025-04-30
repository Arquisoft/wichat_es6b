import React, { useState, useContext } from 'react';
import { Button, Container, Typography, Divider, Snackbar, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SessionContext } from '../context/SessionContext';
import { getCactus, getPulpo, getCoche, getPersona1, getPersona2 } from './Avatars';
import { useNavigate } from 'react-router-dom';

const AvatarSelection = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const { username, avatar, updateAvatar } = useContext(SessionContext);

    const handleAvatarSelect = (avatarPath) => {
        setSelectedAvatar(avatarPath);
    };

    const handleAvatarChange = async () => {
        if (selectedAvatar) {
            try {
                await updateAvatar(selectedAvatar);
                setSnackbarMessage('Avatar cambiado con éxito');
                setOpenSnackbar(true);
            } catch (err) {
                setError(err.message || 'Error al actualizar el avatar');
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, backgroundColor: '#9c27b0', borderRadius: 2, padding: 4, boxShadow: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" sx={{ 
                    color: 'white',
                    fontWeight: 'bold', 
                    fontSize: '3rem',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    {username}
                </Typography>
                <Box sx={{ 
                    width: 150,
                    height: 150,
                    margin: '20px auto',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img 
                        src={avatar || '/white.png'} 
                        alt="Profile pic" 
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }} 
                    />
                </Box>
            </Box>

            <Divider sx={{ backgroundColor: 'white', my: 3 }}/>

            <Typography variant="h5" sx={{ 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: 'white',
                mb: 3
            }}>
                Elige tu avatar
            </Typography>

            <Container sx={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 2
            }}>
                {[
                    { path: getCactus(), name: 'Cactus', testId: 'cactus-button' },
                    { path: getPulpo(), name: 'Pulpo', testId: 'pulpo-button' },
                    { path: getCoche(), name: 'Coche', testId: 'coche-button' },
                    { path: getPersona1(), name: 'Persona 1', testId: 'persona1-button' },
                    { path: getPersona2(), name: 'Persona 2', testId: 'persona2-button' }
                ].map((avatarOption) => (
                    <Button 
                        key={avatarOption.name}
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 2,
                            backgroundColor: selectedAvatar === avatarOption.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }} 
                        onClick={() => handleAvatarSelect(avatarOption.path)}
                        data-testid={avatarOption.testId}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                marginBottom: '8px',
                                border: selectedAvatar === avatarOption.path ? '3px solid white' : '3px solid transparent',
                                overflow: 'hidden',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <img 
                                src={avatarOption.path} 
                                alt={avatarOption.name}
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }} 
                            />
                        </Box>
                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                            {avatarOption.name}
                        </Typography>
                    </Button>
                ))}
            </Container>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                <Button 
                    variant="contained"
                    onClick={handleAvatarChange}
                    data-testid="confirm-button"
                    disabled={!selectedAvatar}
                    sx={{
                        backgroundColor: 'white',
                        color: '#9c27b0',
                        '&:hover': {
                            backgroundColor: '#f3e5f5',
                        },
                        '&:disabled': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            color: 'rgba(0,0,0,0.3)'
                        }
                    }}
                >
                    Confirmar cambios
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => navigate(`/profile/${username}`)}
                    sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                            borderColor: '#f3e5f5',
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    Volver al perfil
                </Button>
            </Box>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={4500} 
                onClose={handleCloseSnackbar} 
                message={snackbarMessage}
            />
            {error && (
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={4500} 
                    onClose={handleCloseError}
                    message={`Error: ${error}`}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseError}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            )}
        </Container>
    );
}

export default AvatarSelection;