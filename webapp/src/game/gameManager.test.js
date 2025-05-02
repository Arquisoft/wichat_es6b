import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../context/SessionContext';
import Jugar from './gameManager';
import Game from './game';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mocks
jest.mock('./game');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('axios');

describe('GameManager Component', () => {
  const mockNavigate = jest.fn();
  const mockGameInstance = {
    fetchQuestions: jest.fn(),
    cancelRequests: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    Game.mockImplementation(() => mockGameInstance);
    jest.useFakeTimers();

    // Configurar localStorage
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('selectedCategories', 'Geografia,Cultura');
  });

  afterEach(() => {
    localStorage.clear();
    jest.useRealTimers();
  });

  const findTimeElement = (expectedTime) => {
    const timeElements = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'h6' &&
             element.textContent.includes(expectedTime);
    });
    return timeElements[0];
  };

  const findMessageInChat = (text) => {
    return screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' &&
             element.textContent.includes(text);
    });
  };

  const renderGameWithMockQuestions = async (difficulty, mockQuestions) => {
    localStorage.setItem('gameDifficulty', difficulty);

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
      expect(screen.getByText(mockQuestions[0].pregunta)).toBeInTheDocument();
    });
  };

  it('should set correct time for easy difficulty', async () => {
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions('Fácil', mockQuestions);
    const timeElement = findTimeElement('40');
    expect(timeElement).toBeInTheDocument();
  });

  it('should set correct time for medium difficulty', async () => {
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions('Medio', mockQuestions);
    const timeElement = findTimeElement('30');
    expect(timeElement).toBeInTheDocument();
  });

  it('should set correct time for hard difficulty', async () => {
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions('Difícil', mockQuestions);
    const timeElement = findTimeElement('20');
    expect(timeElement).toBeInTheDocument();
  });

  it('should use default time when difficulty is not set', async () => {
    localStorage.removeItem('gameDifficulty');
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions(null, mockQuestions);
    const timeElement = findTimeElement('40');
    expect(timeElement).toBeInTheDocument();
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
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions(null, mockQuestions);
  });

  it('should handle answer selection correctly', async () => {
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions(null, mockQuestions);

    const correctAnswer = screen.getByText('París');
    fireEvent.click(correctAnswer);

    await waitFor(() => {
      expect(screen.getByText('+10')).toBeInTheDocument();
    });
  });

  it('should handle chat interaction for hints', async () => {
    const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
    await renderGameWithMockQuestions(null, mockQuestions);

    const chatInput = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(chatInput, { target: { value: '¿Puedes darme una pista?' } });
    
    const sendButton = screen.getByText('Enviar');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Pensando...')).toBeInTheDocument();
    });
  });

  describe('Timer functionality', () => {
    it('should handle timeout correctly', async () => {
      const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
      await renderGameWithMockQuestions('Fácil', mockQuestions);

      act(() => {
        jest.advanceTimersByTime(40000);
      });

      await waitFor(() => {
        const timeoutMessage = screen.getByText((content, element) => {
          return element.classList.contains('timeout-message') &&
                 element.textContent.includes('¡Tiempo Agotado!');
        });
        expect(timeoutMessage).toBeInTheDocument();
      });
    });
  });

  describe('Hint functionality', () => {
    it('should handle hint request successfully', async () => {
      const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
      axios.post.mockResolvedValueOnce({ data: { answer: 'La capital de Francia es una ciudad famosa por su torre Eiffel' } });

      await renderGameWithMockQuestions(null, mockQuestions);

      const chatInput = screen.getByPlaceholderText('Escribe un mensaje...');
      fireEvent.change(chatInput, { target: { value: '¿Puedes darme una pista?' } });
      fireEvent.click(screen.getByText('Enviar'));

      await waitFor(() => {
        const hintMessage = screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'p' &&
                 element.textContent.includes('La capital de Francia es una ciudad famosa por su torre Eiffel');
        });
        expect(hintMessage).toBeInTheDocument();
      });
    });

    it('should handle hint request error', async () => {
      const mockQuestions = [{ pregunta: '¿Capital de Francia?', opciones: ['París', 'Madrid', 'Berlín', 'Roma'], respuesta_correcta: 0 }];
      axios.post.mockRejectedValueOnce(new Error('API Error'));

      await renderGameWithMockQuestions(null, mockQuestions);

      const chatInput = screen.getByPlaceholderText('Escribe un mensaje...');
      fireEvent.change(chatInput, { target: { value: '¿Puedes darme una pista?' } });
      fireEvent.click(screen.getByText('Enviar'));

      await waitFor(() => {
        const errorMessage = screen.getByText((content, element) => {
          return element.tagName.toLowerCase() === 'p' &&
                 element.textContent.includes('Error al comunicarse con el servicio de pistas');
        });
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Game completion', () => {
    it('should save game data correctly', async () => {
      const mockQuestions = [{
        id: '1',
        pregunta: '¿Capital de Francia?',
        opciones: ['París', 'Madrid', 'Berlín', 'Roma'],
        respuesta_correcta: 0,
        imagen: 'http://example.com/image.jpg',
      }];
      
      axios.post.mockResolvedValueOnce({});

      await renderGameWithMockQuestions(null, mockQuestions);

      fireEvent.click(screen.getByText('París'));

      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/savegame'),
        expect.objectContaining({
          username: 'testUser',
          points: 10,
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionId: '1',
              question: '¿Capital de Francia?',
              imageUrl: 'http://example.com/image.jpg',
            }),
          ]),
        })
      );
    });
  });
});
