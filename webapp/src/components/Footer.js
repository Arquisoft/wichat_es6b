import * as React from 'react';
import { AppBar, Toolbar, Typography, Link } from '@mui/material';

const Footer = () => {
    return(
        <AppBar component="footer" position="static" sx={{ backgroundColor: "primary", color: "white", bottom: 0, left: 0, width: '100%', zIndex: 1000}}>
        <Toolbar
            sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
            <Typography sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>
            <Link
                href="https://github.com/Arquisoft/wichat_es6b.git"
                rel="noopener"
                sx={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}
            >
                © WICHAT-ES6B
            </Link>
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'white', display: 'flex', gap: '15px', fontSize: '14px' }}>
            <Link href="https://app.swaggerhub.com/apis/asw-60f/questions-api/1.0.0" sx={{ color: 'white', textDecoration: 'none' }}>
                API de preguntas
            </Link>
            <Link href="https://app.swaggerhub.com/apis/JavierEsquinas/historyapi/1.0.0" sx={{ color: 'white', textDecoration: 'none' }}>
                API del historial
            </Link>
            <Link href="https://app.swaggerhub.com/apis/JavierEsquinas/usersapi/1.0.0" sx={{ color: 'white', textDecoration: 'none' }}>
                API de usuarios
            </Link>
            </Typography>
        </Toolbar>
        </AppBar>
    );
};

export default Footer;