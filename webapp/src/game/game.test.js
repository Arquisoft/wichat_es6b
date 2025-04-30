import axios from 'axios';
import Game from './game';

jest.mock('axios');

describe('Game class', () => {
    let game;
    const mockQuestions = [
        {
            responseQuestion: '¿Cuál es la capital de España?',
            responseOptions: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
            responseCorrectOption: 'Madrid',
            responseImage: 'madrid.jpg'
        },
        {
            responseQuestion: '¿Cuál es el río más largo del mundo?',
            responseOptions: ['Amazonas', 'Nilo', 'Yangtsé', 'Misisipi'],
            responseCorrectOption: 'Amazonas',
            responseImage: 'amazonas.jpg'
        }
    ];

    beforeEach(() => {
        game = new Game(['Geografia', 'Cultura']);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should initialize with empty questions and score 0', () => {
        expect(game.questions).toEqual([]);
        expect(game.score).toBe(0);
    });

    it('pass to the next question if timeout', () => {
        jest.useFakeTimers();
        jest.advanceTimersByTime(31000);
        expect(game.questions).toEqual([]);
        expect(game.score).toBe(0);
    });

    it('should fetch questions successfully', async () => {
        // Mock para todas las llamadas a axios.get
        axios.get.mockImplementation(() => Promise.resolve({ 
            data: {
                responseQuestion: '¿Cuál es la capital de España?',
                responseOptions: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                responseCorrectOption: 'Madrid',
                responseImage: 'madrid.jpg'
            }
        }));

        const mockCallback = jest.fn();
        const result = await game.fetchQuestions(mockCallback);

        expect(axios.get).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
        expect(game.questions.length).toBeGreaterThan(0);
    });

    it('should handle error when fetching questions', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));
        const mockCallback = jest.fn();

        const result = await game.fetchQuestions(mockCallback);

        expect(result).toBeNull();
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should check answer correctly', () => {
        game.questions = [
            {
                id: 'q1',
                pregunta: '¿Cuál es la capital de España?',
                opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                respuesta_correcta: 0,
                imagen: 'madrid.jpg',
                tipo: 'Geografia'
            }
        ];

        // Respuesta correcta
        expect(game.checkAnswer(0, 0)).toBe(true);
        expect(game.score).toBe(10);

        // Respuesta incorrecta
        expect(game.checkAnswer(0, 1)).toBe(false);
        expect(game.score).toBe(10); // El score no debe cambiar
    });

    it('should return the total score', () => {
        game.score = 50;
        expect(game.getTotalScore()).toBe(50);
    });

    it('should cancel requests correctly', () => {
        const originalController = game.controller;
        game.cancelRequests();
        
        expect(game.controller).not.toBe(originalController);
        expect(game.controller.signal).toBeDefined();
    });

    it('should handle multiple questions correctly', async () => {
        // Mock para todas las llamadas a axios.get
        axios.get.mockImplementation(() => Promise.resolve({ 
            data: {
                responseQuestion: '¿Cuál es la capital de España?',
                responseOptions: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                responseCorrectOption: 'Madrid',
                responseImage: 'madrid.jpg'
            }
        }));
        
        const mockCallback = jest.fn();
        const result = await game.fetchQuestions(mockCallback);

        expect(axios.get).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
        expect(game.questions.length).toBeGreaterThan(0);
    });
});