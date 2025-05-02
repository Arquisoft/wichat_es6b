import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { SessionContext } from '../context/SessionContext';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../App';
import Login from '../components/Login';
import { SessionProvider } from '../context/SessionContext';

// Silenciar los warnings específicos de MUI Grid y React Router
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' && (
        args[0].includes('MUI Grid:') ||
        args[0].includes('React Router Future Flag Warning:')
      )
    ) {
      return;
    }
    originalWarn.call(console, ...args); 
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' && (
        args[0].includes('MUI:') || 
        args[0].includes('React Router')
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

const renderWithProviders = (ui, { isLoggedIn = false } = {}) => {
  return render(
    <SessionProvider value={{ isLoggedIn }}>
      {ui}
    </SessionProvider>
  );
};

it('renders login form by default', async () => {
  render(
    <SessionContext.Provider value={{ isLoggedIn: false }}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>
  );
  

  // Click en el botón de inicio
  const startButton = screen.getByTestId('start-button');
  await userEvent.click(startButton);

  // Esperamos a que la navegación se complete
  await waitFor(() => {
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  });

  expect(screen.getByTestId('login-button')).toBeInTheDocument();

  // Click en la pestaña de Signup
  const signupTab = screen.getByRole('tab', { name: /signup/i });
  await userEvent.click(signupTab);

  // Ahora buscamos el botón de signup
  expect(screen.getByTestId('signup-button')).toBeInTheDocument();

  const signUpButton = screen.getByTestId('signup-button');
  await userEvent.click(signUpButton);

  // Esperamos a que la navegación se complete
  await waitFor(() => {
    expect(screen.getByTestId('signup-title')).toBeInTheDocument();
  });
});

it('allows play the game from home if registered', async () => {
  render(
    <SessionContext.Provider value={{ isLoggedIn: true }}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<div>Pregunta 1</div>} />
        </Routes>
      </MemoryRouter>
    </SessionContext.Provider>
  );

  // Click en el botón de inicio
  const startButton = screen.getByTestId('start-button');
  await userEvent.click(startButton);

  await waitFor(() => {
    expect(screen.getByText(/Pregunta/i)).toBeInTheDocument();
  });
});

it('should navigate to login when clicking start button while not logged in', async () => {
  render(
    <SessionProvider value={{ isLoggedIn: false }}>
      <App />
    </SessionProvider>
  );

  const startButton = screen.getByTestId('start-button');
  await userEvent.click(startButton);

  // Verificar que estamos en la página de login
  expect(screen.getByTestId('login-title')).toBeInTheDocument();
});

it('should navigate to game when clicking start button while logged in', async () => {
   render(
    <SessionProvider value={{ isLoggedIn: true }}>
      <App />
    </SessionProvider>);

  const startButton = screen.getByTestId('start-button');
  await userEvent.click(startButton);

  // Verificar que estamos en la página del juego
   expect(screen.getByText(/Pregunta/i)).toBeInTheDocument();
});