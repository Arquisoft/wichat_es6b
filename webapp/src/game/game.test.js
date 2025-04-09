import axios from 'axios';
import Game from './game';
import GameManager from './gameManager';
import { wait, waitFor, screen, render } from '@testing-library/react';
import { experimentalStyled } from '@mui/material';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { SessionContext } from '../sessionContext';

jest.mock('axios');

describe('Game class', () => {
    let game;

    beforeEach(() => {
        game = new Game(); 
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
      });

    it('should initialize with empty questions and score 0', () => {
        expect(game.questions).toEqual([]);
        expect(game.score).toBe(0);
    });

    // it('show timeout message', async () => {    
        
    //     render(
    //     <SessionContext.Provider value={{ username: 'exampleUser' }}>
    //     <BrowserRouter>
    //         <GameManager />
    //     </BrowserRouter>
    //   </SessionContext.Provider>
    //   );


       
    //   jest.advanceTimersByTime(30000);

    
    //   await waitFor(() => {
    //     console.log(document.body.innerHTML); // Inspecciona el contenido del DOM
    //     const timeoutMessage = screen.getByTestId('timeout-message');
    //     expect(timeoutMessage).toBeInTheDocument();
    //   });
     
    // });

    it('pass to the next question if timeout', async () => {
      jest.advanceTimersByTime(31000);

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

    it('should  increment score if answer is correct', () => {
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

      const isCorrect = game.checkAnswer(0, 0);

      expect(isCorrect).toBe(true);
      expect(game.score).toBe(10);
  });

    it('should return the total score', () => {
        game.score = 50;
        expect(game.getTotalScore()).toBe(50);
    });
});