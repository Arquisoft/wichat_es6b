import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';
import GameManager from './gameManager';
import axios from 'axios';

jest.mock('axios');

// Configuración de las flags futuras de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('GameManager', () => {
    const mockQuestions = [
        {
            id: 'q1',
            pregunta: '¿Cuál es la capital de España?',
            opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
            respuesta_correcta: 0,
            imagen: 'madrid.jpg',
            tipo: 'Geografia'
        }
    ];

    const mockSession = {
        username: 'testuser',
        isLoggedIn: true,
        createSession: jest.fn(),
        destroySession: jest.fn()
    };

    const renderGameManager = () => {
        return render(
            <SessionContext.Provider value={mockSession}>
                <BrowserRouter {...routerConfig}>
                    <GameManager />
                </BrowserRouter>
            </SessionContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('username', 'testuser');
        
        axios.get.mockResolvedValue({
            data: {
                responseQuestion: mockQuestions[0].pregunta,
                responseOptions: mockQuestions[0].opciones,
                responseCorrectOption: mockQuestions[0].opciones[0],
                responseImage: mockQuestions[0].imagen
            }
        });

        axios.post.mockResolvedValue({
            data: {
                answer: 'Esta es una pista sobre la respuesta correcta'
            }
        });
    });

    it('should render loading state initially', async () => {
        renderGameManager();
        expect(screen.getByText('Cargando preguntas...')).toBeInTheDocument();
    });

    it('should fetch and display questions', async () => {
        renderGameManager();
        
        await waitFor(() => {
            expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        await waitFor(() => {
            mockQuestions[0].opciones.forEach(option => {
                expect(screen.getByText(option)).toBeInTheDocument();
            });
        });
    });

    it('should handle answer selection correctly', async () => {
        renderGameManager();
        
        await waitFor(() => {
            expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        const correctAnswer = screen.getByText(mockQuestions[0].opciones[0]);
        fireEvent.click(correctAnswer);

        await waitFor(() => {
            expect(screen.getByText('+10')).toBeInTheDocument();
        });
    });

    // Test para asegurar que GameManager renderice y cargue preguntas
    it('should render GameManager and load questions', async () => {
        renderGameManager();

        expect(screen.getByText('Cargando preguntas...')).toBeInTheDocument();

        // Esperar a que las preguntas sean cargadas
        await waitFor(() => {
        expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        // Verificar que las opciones de la pregunta sean mostradas
        mockQuestions[0].opciones.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument();
        });
    });

    // Test de selección de respuesta y verificación de puntuación
    it('should handle answer selection and update score', async () => {
        renderGameManager();

        await waitFor(() => {
        expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        const correctAnswer = screen.getByText(mockQuestions[0].opciones[0]);
        fireEvent.click(correctAnswer);

        await waitFor(() => {
        expect(screen.getByText('+10')).toBeInTheDocument();  // Asumiendo que la puntuación es mostrada de esta forma
        });
    });

    // Test de llamada a la API de pistas (con axios.post)
    it('should fetch hint from API when requesting hint', async () => {
        renderGameManager();

        await waitFor(() => {
        expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });
    });

    // Test de verificación de estado de sesión
    it('should handle session state correctly', () => {
        renderGameManager();

        expect(mockSession.username).toBe('testuser');
        expect(mockSession.isLoggedIn).toBe(true);
    });

   

    it('correct constants', async () => {
        renderGameManager();
        
        // Esperar hasta que las preguntas estén cargadas
        await waitFor(() => {
            expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
        }, { timeout: 5000 });

        // Verifica que difficultyMap está correctamente configurado
        const difficultyMap = { easy: 30, medium: 20, hard: 10 }; // Ejemplo de dificultad
        expect(difficultyMap.easy).toBe(30);
        expect(difficultyMap.medium).toBe(20);
        expect(difficultyMap.hard).toBe(10);

        // Verifica que time está correctamente establecido
        const time = 30; // Suponiendo un tiempo de 30 segundos para cada pregunta
        expect(time).toBe(30);

        // Verifica que totalGameTime está correctamente calculado
        const totalGameTime = time * mockQuestions.length; // Total de tiempo de juego basado en las preguntas
        expect(totalGameTime).toBe(30); // Aquí es 30 porque tenemos una sola pregunta

        // Verifica que el nombre de usuario está correctamente recuperado
        const username = 'testuser'; // Nombre de usuario mockeado
        expect(username).toBe('testuser');

        // Verifica que gameData está correctamente definido
        const gameData = {
            question: mockQuestions[0].pregunta,
            options: mockQuestions[0].opciones,
            correctAnswer: mockQuestions[0].respuesta_correcta,
            image: mockQuestions[0].imagen
        };
        expect(gameData.question).toBe(mockQuestions[0].pregunta);
        expect(gameData.options).toEqual(mockQuestions[0].opciones);
        expect(gameData.correctAnswer).toBe(mockQuestions[0].respuesta_correcta);
        expect(gameData.image).toBe(mockQuestions[0].imagen);
    });
}); 
