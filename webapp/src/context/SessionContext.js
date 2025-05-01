import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState('/default_user.jpg');
  
    useEffect(() => {
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        setIsLoggedIn(true);
        
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
    
    const createSession = (username) => {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setUsername(username);
      setIsLoggedIn(true);
      
      // Recuperar el último avatar usado por este usuario o usar el default
      const lastAvatar = localStorage.getItem(`avatar_${username}`);
      const avatarToUse = lastAvatar || '/white.png';
      
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('username', username);
      localStorage.setItem('avatar', avatarToUse);
      setAvatar(avatarToUse);
    };
  
    const destroySession = () => {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      localStorage.removeItem('avatar');
      setSessionId('');
      setUsername('');
      setIsLoggedIn(false);
      setAvatar('/white.png');
    };

    const updateAvatar = (newAvatar) => {
      setAvatar(newAvatar);
      localStorage.setItem('avatar', newAvatar);
      // Guardar el avatar específico para este usuario
      localStorage.setItem(`avatar_${username}`, newAvatar);
    };
  
    return (
      <SessionContext.Provider
        value={{
          sessionId: sessionId || '',
          username: username || '',
          isLoggedIn: isLoggedIn || false,
          avatar: avatar || '/default_user.jpg',
          createSession,
          destroySession,
          updateAvatar,
        }}
      >
        {children}
      </SessionContext.Provider>
    );
};

// Validamos que 'children' es un nodo React (obligatorio)
SessionProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export { SessionContext, SessionProvider };