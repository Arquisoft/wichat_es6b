import React, { useState } from 'react';
import {motion} from 'framer-motion'; 
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
const FallingElements = () => {
  const elements = Array.from({ length: 10 }); // Generamos 10 elementos

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {elements.map((_, index) => {
        const startX = Math.random() * 100; // Posición inicial aleatoria en el eje X
        const delay = Math.random() * 2; // Diferente tiempo de inicio para cada uno

        return (
          <motion.div
            key={index}
            initial={{ y: "-10vh", x: `${startX}vw`, opacity: 0 }}
            animate={{ y: "110vh", opacity: 1 }}
            transition={{
              duration: 4 + Math.random() * 3, // Velocidad de caída aleatoria
              ease: "linear",
              repeat: Infinity,
              delay: delay,
            }}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: "#ff758c",
              borderRadius: "50%",
            }}
          />
        );
      })}
    </div>
  );
};
function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
    <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: -1,
          background: "linear-gradient(270deg, #ff7eb3, #ff758c, #ff92c2, #c679e3)",
          backgroundSize: "400% 400%",
        }}
      />

    <Container component="header" maxWidth={false} 
      sx={{
       backgroundColor: "#33779d",
        margin: 0,       
        height: "5vh", 
        position: "absolute", 
        top: 0,         
        left: 0,        
        paddingBottom: 10, 
      
      }}
    >
    <Typography component="h3" variant="h4" align="center" sx={{ marginTop: 2 }}>
        Welcome to the 2025 edition of the Wichat game 
    </Typography>

    </Container>
    <Container component="main" maxWidth="s">
      <CssBaseline />
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 1, b: 'black' }}>
        {showLogin ? (
          <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView} sx={{
            color : 'black'
          }}>
            Don't have an account? Register here.
          </Link>
        ) : (
          <Link component="button" variant="body2" onClick={handleToggleView} sx={{
            color : 'black'
          }}>
            Already have an account? Login here.
          </Link>
        )}
      </Typography>

      <motion.div
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
        <Typography component="h3" variant="h3" align="center" 
        sx={{
          margin : 4
        }}
        >
        ¡Realizado por wichat_es6b!
      </Typography>
      </motion.div>
    </Container>
    </>
  );
}

export default App;
