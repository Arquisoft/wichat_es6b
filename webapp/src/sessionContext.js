import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'; // Para hacer peticiones al backend

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState('/default_user.jpg');
    const [token, setToken] = useState(null); // Guarda el token JWT

    // Recuperar la sesión del localStorage cuando el componente se monta
    useEffect(() => {
      const storedSessionId = localStorage.getItem('sessionId');
      const storedToken = localStorage.getItem('token'); // Si hay un token guardado

      if (storedSessionId && storedToken) {
        setSessionId(storedSessionId);
        setToken(storedToken);
        setIsLoggedIn(true);
        
        // Recuperar el username y avatar si están disponibles
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }

        const storedAvatar = localStorage.getItem('avatar');
        if (storedAvatar) {
            setAvatar(storedAvatar);
        }
      }
    }, []);

    // Crear sesión con un username, después de login exitoso
    const createSession = (username, token, avatar) => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setUsername(username);
      setIsLoggedIn(true);
      setToken(token);
      setAvatar(avatar);
      
      // Guardar datos en localStorage
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);
      localStorage.setItem('avatar', avatar || '/default_user.jpg');
    };

    // Cerrar sesión
    const destroySession = () => {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('avatar');
      
      setSessionId('');
      setUsername('');
      setToken(null);
      setIsLoggedIn(false);
      setAvatar('/default_user.jpg');
    };

    // Actualizar avatar
    const updateAvatar = (newAvatar) => {
      setAvatar(newAvatar);
      localStorage.setItem('avatar', newAvatar);
    };

    // Función de login que conecta con el servicio de autenticación
    const login = async (username, password) => {
      try {
        const response = await axios.post('http://localhost:8002/login', { username, password });
        const { token, createdAt } = response.data;
        
        // Almacenar sesión después de login exitoso
        createSession(username, token, '/default_user.jpg');
      } catch (error) {
        console.error("Error en el login", error);
      }
    };

    // Función para hacer logout
    const logout = () => {
      destroySession();
    };

    return (
      <SessionContext.Provider value={{ sessionId, username, isLoggedIn, avatar, login, logout, updateAvatar, token }}>
        {children}
      </SessionContext.Provider>
    );
};

export { SessionContext, SessionProvider };
