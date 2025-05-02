import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../context/SessionContext';
import Jugar from './gameManager';
import Game from './game';
import { useNavigate } from 'react-router-dom';

// Mocks
jest.mock('./game');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('GameManager Component', () => {
  const mockNavigate = jest.fn();
  const mockGameInstance = {
    fetchQuestions: jest.fn(),
    cancelRequests: jest.fn()
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    Game.mockImplementation(() => mockGameInstance);

    // Configurar localStorage
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('selectedCategories', 'Geografia,Cultura');
    localStorage.setItem('gameDifficulty', 'Fácil');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to home if no username is found', () => {
    localStorage.removeItem('username');
    
    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show loading state initially', () => {
    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando preguntas...')).toBeInTheDocument();
  });

  it('should initialize game with questions', async () => {
    const mockQuestions = [{
      pregunta: '¿Capital de Francia?',
      opciones: ['París', 'Madrid', 'Berlín', 'Roma'],
      respuesta_correcta: 0
    }];

    mockGameInstance.fetchQuestions.mockImplementation((callback) => {
      callback(mockQuestions);
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
    });
  });

  it('should handle answer selection correctly', async () => {
    const mockQuestions = [{
      pregunta: '¿Capital de Francia?',
      opciones: ['París', 'Madrid', 'Berlín', 'Roma'],
      respuesta_correcta: 0
    }];

    mockGameInstance.fetchQuestions.mockImplementation((callback) => {
      callback(mockQuestions);
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
    });

    const correctAnswer = screen.getByText('París');
    fireEvent.click(correctAnswer);

    await waitFor(() => {
      expect(screen.getByText('+10')).toBeInTheDocument();
    });
  });

  it('should handle chat interaction for hints', async () => {
    const mockQuestions = [{
      pregunta: '¿Capital de Francia?',
      opciones: ['París', 'Madrid', 'Berlín', 'Roma'],
      respuesta_correcta: 0
    }];

    mockGameInstance.fetchQuestions.mockImplementation((callback) => {
      callback(mockQuestions);
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
    });

    const chatInput = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(chatInput, { target: { value: '¿Puedes darme una pista?' } });
    
    const sendButton = screen.getByText('Enviar');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Pensando...')).toBeInTheDocument();
    });
  });

});