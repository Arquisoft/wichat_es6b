import * as React from 'react';
import { useContext } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Typography, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { SessionContext } from '../sessionContext';
import SettingsIcon from '@mui/icons-material/Settings';

function NavBar() {
  const { username = '', isLoggedIn = false, avatar = '/default_user.jpg', destroySession } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    destroySession();
    window.location.reload();
  };

  // List of site pages for the menu
  const pages = [
    { path: '/game', text: "Jugar" },
    { path: '/ranking', text: "Ranking" },

  ];

  const logo = (
    <Button component={Link} to="/" sx={{ '&:hover': { backgroundColor: '#5f7e94' } }}>
      <img src="/logo_texto.png" alt="Logo" style={{ height: 40 }} />
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo a la izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {logo}
          {isLoggedIn && (
            <Box sx={{ display: 'flex', ml: 2 }}>
              {pages.map((page) => (
                <Button
                  component={Link}
                  size="large"
                  to={page.path === '/stats' ? `/stats/${username}` : page.path}
                  key={page.path}
                  sx={{ color: 'white', '&:hover': { backgroundColor: '#5f7e94' } }}
                >
                  {page.text}
                </Button>
              ))}
               {isLoggedIn && (
                <Button
                  component={Link}
                  to="/settings"
                  size="large"
                  sx={{
                    color: 'white',
                    '&:hover': { backgroundColor: '#5f7e94' },
                  }}
                >
                  <SettingsIcon sx={{ marginRight: 1 }} />
                  Ajustes de juego
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Usuario o login a la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: "2em" }}>
          {isLoggedIn ? (
            <>
              <Button
                component={Link}
                to={`/profile/${username}`}
                sx={{
                  p: 0,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { backgroundColor: '#5f7e94' },
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', paddingLeft: '0.5em' }}>
                  {username}
                </Typography>
                <IconButton>
                  <Avatar src={avatar} alt="Profile pic" sx={{ width: 33, height: 33 }} 
                    aria-label="current user account"
                  />
                  
                </IconButton>
              </Button>
              <IconButton
                size="large"
                onClick={handleLogout}
                sx={{ color: 'white', '&:hover': { backgroundColor: '#5f7e94' } }}
                data-testid="logout-button"
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Button
              component={Link}
              to={'/login'}
              sx={{
                p: 0,
                display: 'flex',
                alignItems: 'center',
                '&:hover': { backgroundColor: '#5f7e94' },
              }}
            >
              <Typography variant="body2" sx={{ color: 'white', paddingLeft: '0.5em' }}>
                Log In
              </Typography>
              <IconButton>
                <Avatar
                  src="/default_user.jpg"
                  sx={{ width: 33, height: 33, bgcolor: 'white' }}
                />
              </IconButton>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
