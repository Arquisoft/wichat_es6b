import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AvatarSelection from './AvatarSelection';
import { SessionContext } from '../context/SessionContext';

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

// Función auxiliar para renderizar el componente con el contexto
const renderWithContext = (contextValue = {}) => {
  const defaultContext = {
    username: 'testUser',
    avatar: '/default_user.jpg',
    updateAvatar: jest.fn(),
    ...contextValue
  };

  return render(
    <SessionContext.Provider value={defaultContext}>
      <BrowserRouter {...routerConfig}>
        <AvatarSelection />
      </BrowserRouter>
    </SessionContext.Provider>
  );
};

// Función auxiliar para seleccionar un avatar
const selectAvatar = async (avatarTestId = 'cactus-button') => {
  const avatarButton = screen.getByTestId(avatarTestId);
  fireEvent.click(avatarButton);
  return avatarButton;
};

// Función auxiliar para confirmar la selección
const confirmSelection = async () => {
  const confirmButton = screen.getByTestId('confirm-button');
  fireEvent.click(confirmButton);
  return confirmButton;
};

describe('AvatarSelection component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the component with user information', () => {
    renderWithContext();

    expect(screen.getByText('testUser')).toBeInTheDocument();
    const currentAvatar = screen.getByAltText('Profile pic');
    expect(currentAvatar).toHaveAttribute('src', '/default_user.jpg');
    expect(screen.getByTestId('cactus-button')).toBeInTheDocument();
    expect(screen.getByTestId('pulpo-button')).toBeInTheDocument();
    expect(screen.getByTestId('coche-button')).toBeInTheDocument();
    expect(screen.getByTestId('persona1-button')).toBeInTheDocument();
    expect(screen.getByTestId('persona2-button')).toBeInTheDocument();
  });

  it('should handle avatar selection', async () => {
    renderWithContext();
    await selectAvatar();
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).not.toBeDisabled();
  });

  it('should update avatar when confirming selection', async () => {
    const mockUpdateAvatar = jest.fn();
    renderWithContext({ updateAvatar: mockUpdateAvatar });
    
    await selectAvatar();
    await confirmSelection();

    expect(mockUpdateAvatar).toHaveBeenCalledWith('/icono_cactus.png');
  });

  it('should navigate back to profile when clicking return button', async () => {
    renderWithContext();
    const returnButton = screen.getByText('Volver al perfil');
    fireEvent.click(returnButton);
    expect(mockNavigate).toHaveBeenCalledWith('/profile/testUser');
  });

  it('should show success message when avatar is updated', async () => {
    renderWithContext();
    await selectAvatar();
    await confirmSelection();

    await waitFor(() => {
      expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
    });
  });

  it('should render with default avatar when no avatar is provided', () => {
    renderWithContext({ avatar: null });
    const avatarImage = screen.getByAltText('Profile pic');
    expect(avatarImage.src).toContain('/white.png');
  });

  it('should render with provided avatar', () => {
    renderWithContext({ avatar: '/test-avatar.png' });
    const avatarImage = screen.getByAltText('Profile pic');
    expect(avatarImage.src).toContain('/test-avatar.png');
  });

  it('should show error message when error occurs', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error('Test error message'));
    renderWithContext({ updateAvatar: mockUpdateAvatar });
    
    await selectAvatar();
    await confirmSelection();
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    });
  });

  it('should clear error when Snackbar is closed', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error('Test error message'));
    renderWithContext({ updateAvatar: mockUpdateAvatar });
    
    await selectAvatar();
    await confirmSelection();
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Error: Test error message')).not.toBeInTheDocument();
    });
  });

  it('should not update avatar when no avatar is selected', async () => {
    const mockUpdateAvatar = jest.fn();
    renderWithContext({ updateAvatar: mockUpdateAvatar });

    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
    fireEvent.click(confirmButton);

    expect(mockUpdateAvatar).not.toHaveBeenCalled();
  });

  it('should handle error with default message when error has no message', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error());
    renderWithContext({ updateAvatar: mockUpdateAvatar });
    
    await selectAvatar();
    await confirmSelection();
    
    await waitFor(() => {
      expect(screen.getByText('Error: Error al actualizar el avatar')).toBeInTheDocument();
    });
  });

  it('should close success message when Snackbar is closed', async () => {
    renderWithContext();
    
    await selectAvatar();
    await confirmSelection();
    
    await waitFor(() => {
      expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(4500);

    await waitFor(() => {
      expect(screen.queryByText('Avatar cambiado con éxito')).not.toBeInTheDocument();
    });
  });

  it('should not update avatar when selectedAvatar is null', async () => {
    const mockUpdateAvatar = jest.fn();
    renderWithContext({ updateAvatar: mockUpdateAvatar });
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    expect(mockUpdateAvatar).not.toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.queryByText('Avatar cambiado con éxito')).not.toBeInTheDocument();
    });
  });
}); 