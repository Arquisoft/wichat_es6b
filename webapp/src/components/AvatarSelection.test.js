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

describe('AvatarSelection component', () => {
  const mockContextValue = {
    username: 'testUser',
    avatar: '/default_user.jpg',
    updateAvatar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the component with user information', () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

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
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).not.toBeDisabled();
  });

  it('should update avatar when confirming selection', async () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const cactusButton = screen.getByTestId('cactus-button');
    fireEvent.click(cactusButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    expect(mockContextValue.updateAvatar).toHaveBeenCalledWith('/icono_cactus.png');
  });

  it('should navigate back to profile when clicking return button', async () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const returnButton = screen.getByText('Volver al perfil');
    fireEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile/testUser');
  });

  it('should show success message when avatar is updated', async () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
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

  it('should render with default avatar when no avatar is provided', () => {
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: jest.fn()
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const avatarImage = screen.getByAltText('Profile pic');
    expect(avatarImage.src).toContain('/white.png');
  });

  it('should render with provided avatar', () => {
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: '/test-avatar.png',
        updateAvatar: jest.fn()
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const avatarImage = screen.getByAltText('Profile pic');
    expect(avatarImage.src).toContain('/test-avatar.png');
  });

  it('should show error message when error occurs', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error('Test error message'));
    
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: mockUpdateAvatar
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    });
  });

  it('should clear error when Snackbar is closed', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error('Test error message'));
    
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: mockUpdateAvatar
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Error: Test error message')).not.toBeInTheDocument();
    });
  });

  it('should handle avatar selection and update', async () => {
    const mockUpdateAvatar = jest.fn();
    
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: mockUpdateAvatar
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    expect(mockUpdateAvatar).toHaveBeenCalledWith('/icono_cactus.png');
  });

  it('should show success message after avatar update', async () => {
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: jest.fn()
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
    });
  });

  it('should not update avatar when no avatar is selected', async () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );

    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
    fireEvent.click(confirmButton);

    expect(mockContextValue.updateAvatar).not.toHaveBeenCalled();
  });

  it('should handle error with default message when error has no message', async () => {
    const mockUpdateAvatar = jest.fn().mockRejectedValue(new Error());
    
    render(
      <SessionContext.Provider value={{
        username: 'testUser',
        avatar: null,
        updateAvatar: mockUpdateAvatar
      }}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Error al actualizar el avatar')).toBeInTheDocument();
    });
  });

  it('should close success message when Snackbar is closed', async () => {
    render(
      <SessionContext.Provider value={mockContextValue}>
        <BrowserRouter {...routerConfig}>
          <AvatarSelection />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    
    const avatarButton = screen.getByTestId('cactus-button');
    fireEvent.click(avatarButton);
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText('Avatar cambiado con éxito')).toBeInTheDocument();
    });

    jest.advanceTimersByTime(4500);

    await waitFor(() => {
      expect(screen.queryByText('Avatar cambiado con éxito')).not.toBeInTheDocument();
    });
  });
}); 