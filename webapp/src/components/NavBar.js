import * as React from 'react';
import { useContext } from 'react';
import { AppBar, Toolbar, Menu, MenuItem, Box, Button, IconButton, Typography, Avatar, Select } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import TranslateIcon from '@mui/icons-material/Translate';
import { Link, useNavigate } from 'react-router-dom';
import { SessionContext } from '../sessionContext';

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { username, isLoggedIn, avatar, destroySession } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    navigate('/');
    destroySession();
  };

  const pages = [
    { path: '/homepage', text: "Jugar" },
    { path: '/statistics', text: "Estadísticas" },
    { path: '/instructions', text: "Instrucciones" },
    { path: '/group/menu', text: "Grupos" },
    { path: '/ranking', text: "Ranking" }
  ];

  const logo = (
    <Button component={Link} to="/" sx={{ '&:hover': { backgroundColor: '#5f7e94' } }}>
      <img src="/white_logo.png" alt="Logo" style={{ height: 40 }} />
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        {isLoggedIn ? (
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar-pages"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-pages"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                  <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{page.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
            {logo}
          </Box>
        ) : (
          <>{logo}</>
        )}

        {isLoggedIn ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {logo}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {pages.map((page) => (
                <Button
                  component={Link}
                  size="large"
                  to={page.path}
                  key={page.path}
                  sx={{ color: 'white', '&:hover': { backgroundColor: '#5f7e94' } }}
                >
                  {page.text}
                </Button>
              ))}
            </Box>
          </Box>
        ) : (
          <Box></Box>
        )}

        <Box sx={{ display: "flex", gap: { sm: "0.5em", lg: "2em" } }}>
          {isLoggedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button component={Link} to="/profile" sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0 }}>
                  <Typography variant="body2" sx={{ color: 'white', paddingLeft: '0.5em' }}>
                    {username}
                  </Typography>
                  <IconButton>
                    <Avatar src={avatar} alt="Profile pic" sx={{ width: 33, height: 33 }} />
                  </IconButton>
                </Button>
              </Box>
              <IconButton size="large" onClick={handleLogout} sx={{ color: 'white' }}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Button component={Link} to={'/login'} sx={{ p: 0, display: 'flex', alignItems: 'center', flexGrow: 0 }}>
              <Typography variant="body2" sx={{ color: 'white', paddingLeft: '0.5em' }}>
                Iniciar sesión
              </Typography>
              <IconButton>
                <Avatar src="/default_user.jpg" alt="Profile pic" sx={{ width: 33, height: 33 }} />
              </IconButton>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
