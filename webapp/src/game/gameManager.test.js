import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../context/SessionContext';
import Jugar from './gameManager';
import userEvent from '@testing-library/user-event';
import Game from './game';
import { useNavigate } from 'react-router-dom';


jest.mock('./game');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

it('redirects to / if username is not in localStorage', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);
  
  // limpiar el username
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


describe('GameManager Component', () => {
  beforeEach(() => {
  localStorage.setItem('username', 'testUser');

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]), // o puedes devolver preguntas de ejemplo aquí
    })
  );
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks(); // limpia mocks como fetch
});


  // it('renders loading text', () => {
  //   render(
  //     <MemoryRouter>
  //       <SessionProvider value={{ isLoggedIn: true }}>
  //         <Jugar />
  //       </SessionProvider>
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByText('Cargando preguntas...')).toBeInTheDocument();
  // });


it('redirects to / if username is not in localStorage', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);
  
  // limpiar el username
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

// it('initializes Game instance and fetches questions', async () => {
//   const fetchQuestionsMock = jest.fn((cb) => cb([{
//     id: '1',
//     pregunta: '¿Capital de Francia?',
//     opciones: ['París', 'Madrid'],
//     respuesta_correcta: 0
//   }]));
  
//   Game.mockImplementation(() => ({
//     fetchQuestions: fetchQuestionsMock,
//     cancelRequests: jest.fn()
//   }));

//   localStorage.setItem('username', 'testuser');
//   localStorage.setItem('selectedCategories', 'Geografia');

//   render(
//     <MemoryRouter>
//       <SessionProvider value={{ isLoggedIn: true }}>
//         <Jugar />
//       </SessionProvider>
//     </MemoryRouter>
//   );

  
//     await expect(fetchQuestionsMock).toHaveBeenCalled();
//     await expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
// });


// it('selecting the correct answer increases score and advances', async () => {
//   const fetchQuestionsMock = jest.fn((cb) => cb([
//     {
//       id: '1',
//       pregunta: '¿Capital de Francia?',
//       opciones: ['París', 'Madrid'],
//       respuesta_correcta: 0
//     },
//     {
//       id: '2',
//       pregunta: '¿Moneda de Japón?',
//       opciones: ['Yen', 'Euro'],
//       respuesta_correcta: 0
//     }
//   ]));

//   Game.mockImplementation(() => ({
//     fetchQuestions: fetchQuestionsMock,
//     cancelRequests: jest.fn()
//   }));

//   localStorage.setItem('username', 'testuser');
//   localStorage.setItem('selectedCategories', 'Geografia');
//   localStorage.setItem('gameDifficulty', 'Fácil');

//   render(
//     <MemoryRouter>
//       <SessionProvider value={{ isLoggedIn: true }}>
//         <Jugar />
//       </SessionProvider>
//     </MemoryRouter>
//   );

//   await waitFor(() => {
//     expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
//   });

//   const option = screen.getByText('París');
//   userEvent.click(option);

//   // esperar avance a siguiente pregunta
//   await waitFor(() => {
//     expect(screen.getByText('¿Moneda de Japón?')).toBeInTheDocument();
//   });
// });

// it('handles timeout and shows message', async () => {
//   jest.useFakeTimers();

//   Game.mockImplementation(() => ({
//     fetchQuestions: (cb) => cb([{
//       id: '1',
//       pregunta: '¿Capital de Francia?',
//       opciones: ['París', 'Madrid'],
//       respuesta_correcta: 0
//     }]),
//     cancelRequests: jest.fn()
//   }));

//   localStorage.setItem('username', 'testuser');

//   render(
//     <MemoryRouter>
//       <SessionProvider value={{ isLoggedIn: true }}>
//         <Jugar />
//       </SessionProvider>
//     </MemoryRouter>
//   );

//   await waitFor(() => {
//     expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
//   });

//   // forzamos el timeout
//   jest.advanceTimersByTime(41000); // mayor a maxTime = 40s

//   await waitFor(() => {
//     expect(screen.getByText(/se acabó el tiempo/i)).toBeInTheDocument();
//   });

//   jest.useRealTimers();
});



