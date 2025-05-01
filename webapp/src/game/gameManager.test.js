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
}); 