import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvatarSelection from './AvatarSelection';
import { SessionContext } from '../context/SessionContext';
import '@testing-library/jest-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Configuración de las flags futuras de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('AvatarSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('muestra los avatares disponibles cuando el usuario está loggeado', async () => {
    const username = "testUser";
    const mockUpdateAvatar = jest.fn();
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: mockUpdateAvatar,
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const title = screen.getByText('Elige tu avatar');
    await expect(title).toBeInTheDocument();

    const avatares = screen.getAllByRole('img');
    expect(avatares).toHaveLength(6); // 5 avatares + el avatar actual
  });

  it('permite seleccionar un avatar y confirmar el cambio', async () => {
    const username = "testUser";
    const mockUpdateAvatar = jest.fn().mockResolvedValue(true);
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: mockUpdateAvatar,
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockUpdateAvatar).toHaveBeenCalledWith('/icono_cactus.png');
    });
  });

  it('navega al perfil del usuario al hacer clic en el botón de retorno', async () => {
    const username = "testUser";
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: jest.fn(),
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const returnButton = screen.getByText('Volver al perfil');
    fireEvent.click(returnButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/profile/${username}`);
    });
  });

  it('muestra el mensaje de éxito cuando se actualiza el avatar correctamente', async () => {
    const username = "testUser";
    const mockUpdateAvatar = jest.fn().mockResolvedValue(true);
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: mockUpdateAvatar,
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
    });
  });

  it('muestra el avatar por defecto cuando no hay avatar seleccionado', async () => {
    const username = "testUser";
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: null,
        updateAvatar: jest.fn(),
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const avatarImage = screen.getByAltText('Profile pic');
    await expect(avatarImage.src).toContain('/default_user.jpg');
  });

  it('muestra el avatar proporcionado cuando existe', async () => {
    const username = "testUser";
    const testAvatar = '/test-avatar.png';
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: testAvatar,
        updateAvatar: jest.fn(),
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const avatarImage = screen.getByAltText('Profile pic');
    await expect(avatarImage.src).toContain(testAvatar);
  });

  it('muestra un mensaje de error cuando falla la actualización del avatar', async () => {
    const username = "testUser";
    const errorMessage = 'Error al actualizar el avatar';
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error(errorMessage));
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: mockUpdateAvatar,
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('mantiene el botón de confirmar deshabilitado cuando no hay avatar seleccionado', async () => {
    const username = "testUser";
    const mockUpdateAvatar = jest.fn();
    
    render(
      <SessionContext.Provider value={{ 
        username: username, 
        avatar: '/default_user.jpg',
        updateAvatar: mockUpdateAvatar,
        isLoggedIn: true 
      }}>
        <MemoryRouter {...routerConfig}>
          <AvatarSelection />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
    
    fireEvent.click(confirmButton);
    await expect(mockUpdateAvatar).not.toHaveBeenCalled();
  });
}); 