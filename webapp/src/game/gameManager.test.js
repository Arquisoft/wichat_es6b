import axios from 'axios';
import Game from './game';

jest.mock('axios');

describe('Game class', () => {
  let game;
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  beforeEach(() => {
    game = new Game(['Geografia', 'Cultura']); 
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with empty questions and score 0', () => {
    expect(game.questions).toEqual([]);
    expect(game.score).toBe(0);
  });

//  it('should fetch questions successfully', async () => {
//   const mockQuestions = [
//     {
//       id: 'q1',
//       pregunta: '¿Cuál es la capital de España?',
//       opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
//       respuesta_correcta: 0,
//       imagen: 'imagen1.jpg',
//       tipo: 'Geografia', // Nota: El tipo aquí es Geografia
//     }
//   ];

//   // Mockea la respuesta de axios.get
//   axios.get.mockResolvedValueOnce({ data: mockQuestions });

//   const mockCallback = jest.fn();

//   // Llama a la función que quieres probar
//   // Asumiendo que fetchQuestions no necesita argumentos específicos para la temática en este test
//   await game.fetchQuestions(mockCallback);

//   // --- Corrección aquí ---
//   // Verifica que axios.get fue llamado con la URL y el objeto de parámetros correctos
//   expect(axios.get).toHaveBeenCalledWith(
//     `${apiEndpoint}/generateQuestions`, // Primer argumento: la URL base
//     { // Segundo argumento: el objeto de configuración
//       params: { // Dentro de la configuración, el objeto params
//         language: "es",
//         thematic: "Geografia",
//       },
//     signal: expect.any(AbortSignal), // Verifica que se pase una señal de AbortController
//     }
//   );
// });

  it('should handle error when fetching questions', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error')); 
    const mockCallback = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await game.fetchQuestions(mockCallback);
    
    expect(result).toBeNull();
    expect(mockCallback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should check answer correctly - correct answer', () => {
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

    // Respuesta correcta
    expect(game.checkAnswer(0, 0)).toBe(true);
    expect(game.score).toBe(10);
  });

  it('should check answer correctly - incorrect answer', () => {
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

    // Respuesta incorrecta
    expect(game.checkAnswer(0, 1)).toBe(false);
    expect(game.score).toBe(0); // El score no debe cambiar
  });

  it('should return the total score', () => {
    game.score = 50;
    expect(game.getTotalScore()).toBe(50);
  });

  it('should handle non-existent question index when checking answer', () => {
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

    // Índice de pregunta inválido
    expect(game.checkAnswer(10, 0)).toBe(false);
    expect(game.score).toBe(0);
  });

//   it('should handle multiple categories correctly', async () => {
//     const game = new Game(['Futbolistas', 'Pintores', 'Cantantes']);
//     axios.get.mockResolvedValueOnce({ data: [] });
    
//     await game.fetchQuestions(() => {});
    
//     expect(axios.get).toHaveBeenCalledWith(
//   "http://localhost:8000/generateQuestions",
//   { params: { language: "es", thematic: "Futbolistas" } }
//     );
//   });

});