import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AvatarSelection from './AvatarSelection';
import { SessionContext } from '../context/SessionContext';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AvatarSelection component', () => {
  const mockContextValue = {
    username: 'testUser',
    avatar: '/default_user.jpg',
    updateAvatar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with user information', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    // Verificar que se muestra el nombre de usuario
    expect(screen.getByText('testUser')).toBeInTheDocument();

    // Verificar que se muestra el avatar actual
    const currentAvatar = screen.getByAltText('Profile pic');
    expect(currentAvatar).toHaveAttribute('src', '/default_user.jpg');

    // Verificar que se muestran todos los avatares disponibles
    expect(screen.getByTestId('cactus-button')).toBeInTheDocument();
    expect(screen.getByTestId('pulpo-button')).toBeInTheDocument();
    expect(screen.getByTestId('coche-button')).toBeInTheDocument();
    expect(screen.getByTestId('persona1-button')).toBeInTheDocument();
    expect(screen.getByTestId('persona2-button')).toBeInTheDocument();
  });

  it('should handle avatar selection', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    // Seleccionar un avatar
    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    // Verificar que el botón de confirmar está habilitado
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).not.toBeDisabled();
  });

  it('should update avatar when confirming selection', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    // Seleccionar un avatar
    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    // Confirmar la selección
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    // Verificar que se llamó a updateAvatar con el avatar correcto
    expect(mockContextValue.updateAvatar).toHaveBeenCalledWith('/icono_cactus.png');
  });

  it('should navigate back to profile when clicking return button', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    // Hacer clic en el botón de volver
    const returnButton = screen.getByText('Volver al perfil');
    fireEvent.click(returnButton);

    // Verificar que se llamó a navigate con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/profile/testUser');
  });

  it('should show success message when avatar is updated', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    // Seleccionar y confirmar un avatar
    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    // Verificar que se muestra el mensaje de éxito
    expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
  });
}); 