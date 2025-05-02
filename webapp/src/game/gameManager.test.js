import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../context/SessionContext';
import Jugar from './gameManager';

describe('GameManager Component', () => {
  it('renders loading text', () => {
    render(
      <MemoryRouter>
        <SessionProvider value={{ isLoggedIn: true }}>
          <Jugar />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando preguntas...')).toBeInTheDocument();
  });


  // it('should render game interface after loading', async () => {
  //   render(
  //     <MemoryRouter>
  //       <SessionProvider value={{ isLoggedIn: true }}>
  //         <Jugar />
  //       </SessionProvider>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.queryByText('Cargando preguntas...')).not.toBeInTheDocument();
  //   }, { timeout: 5000 });
  // }); 
});
  // it('should handle answer selection and scoring', async () => {
  //   render(
  //     <MemoryRouter>
  //       <SessionProvider value={{ isLoggedIn: true }}>
  //         <Jugar />
  //       </SessionProvider>
  //     </MemoryRouter>
  //   );

  //   // Esperar a que se cargue la pregunta
  //   await waitFor(() => {
  //     const questionText = screen.queryByText(/Pregunta/i);
  //     expect(questionText).toBeInTheDocument();
  //   }, { timeout: 5000 });

  //   // Seleccionar una respuesta
  //   const answerButton = screen.getByText('París');
  //   fireEvent.click(answerButton);

  //   // Verificar que se muestra la retroalimentación
  //   await waitFor(() => {
  //     expect(screen.getByText('+10')).toBeInTheDocument();
  //   }, { timeout: 5000 });
  // });

//   it('should handle chat interaction for hints', async () => {
//     render(
//       <MemoryRouter>
//         <SessionProvider value={{ isLoggedIn: true }}>
//           <Jugar />
//         </SessionProvider>
//       </MemoryRouter>
//     );

//     // Esperar a que se cargue la pregunta
//     await waitFor(() => {
//       const questionText = screen.queryByText(/Pregunta/i);
//       expect(questionText).toBeInTheDocument();
//     }, { timeout: 5000 });

//     // Interactuar con el chat
//     const chatInput = screen.getByPlaceholderText('Escribe un mensaje...');
//     fireEvent.change(chatInput, { target: { value: '¿Puedes darme una pista?' } });
    
//     const sendButton = screen.getByText('Enviar');
//     fireEvent.click(sendButton);

//     // Verificar que se muestra el mensaje de "Pensando..."
//     await waitFor(() => {
//       expect(screen.getByText('Pensando...')).toBeInTheDocument();
//     }, { timeout: 5000 });

//     // Verificar que se muestra la pista
//     await waitFor(() => {
//       expect(screen.getByText('Esta es una pista de prueba')).toBeInTheDocument();
//     }, { timeout: 5000 });
//   });

//   it('should handle game completion and score saving', async () => {
//     render(
//       <MemoryRouter>
//         <SessionProvider value={{ isLoggedIn: true }}>
//           <Jugar />
//         </SessionProvider>
//       </MemoryRouter>
//     );

//     // Esperar a que se cargue la pregunta
//     await waitFor(() => {
//       const questionText = screen.queryByText(/Pregunta/i);
//       expect(questionText).toBeInTheDocument();
//     }, { timeout: 5000 });

//     // Responder todas las preguntas
//     const answerButton = screen.getByText('París');
//     fireEvent.click(answerButton);

//     // Verificar que se muestra la pantalla de finalización
//     await waitFor(() => {
//       expect(screen.getByText('¡Juego terminado!')).toBeInTheDocument();
//     }, { timeout: 5000 });

//     // Verificar que se muestra el botón para ver el historial
//     expect(screen.getByText('Ver mi historial')).toBeInTheDocument();
//   });

//   it('should handle timeout correctly', async () => {
//     render(
//       <MemoryRouter>
//         <SessionProvider value={{ isLoggedIn: true }}>
//           <Jugar />
//         </SessionProvider>
//       </MemoryRouter>
//     );

//     // Esperar a que se cargue la pregunta
//     await waitFor(() => {
//       const questionText = screen.queryByText(/Pregunta/i);
//       expect(questionText).toBeInTheDocument();
//     }, { timeout: 5000 });

//     // Esperar a que se agote el tiempo
//     await waitFor(() => {
//       expect(screen.getByText('⏳ ¡Tiempo Agotado!')).toBeInTheDocument();
//     }, { timeout: 5000 });
//   });
