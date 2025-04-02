import axios from 'axios';
import Game from './game';

jest.mock('axios');

describe('Game class', () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    it('should initialize with empty questions and score 0', () => {
        expect(game.questions).toEqual([]);
        expect(game.score).toBe(0);
    });


    it('should handle error when fetching questions', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        const fetchedQuestions = await game.fetchQuestions();

        expect(fetchedQuestions).toBeNull();
    });

    it('should not increment score if answer is incorrect', () => {
        game.questions = [
            {
                id: 'q1',
                pregunta: '¿Cuál es la capital de España?',
                opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                respuesta_correcta: 0,
                imagen: 'imagen1.jpg',
                tipo: 'Geografia',
            },
        ];

        const isCorrect = game.checkAnswer(0, 1);

        expect(isCorrect).toBe(false);
        expect(game.score).toBe(0);
    });

    it('should return the total score', () => {
        game.score = 50;
        expect(game.getTotalScore()).toBe(50);
    });
});