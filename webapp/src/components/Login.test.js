// __tests__/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SessionContext } from '../context/SessionContext';

const mock = new MockAdapter(axios);
const mockCreateSession = jest.fn();

const renderWithContext = () => {
  render(
    <SessionContext.Provider value={{ createSession: mockCreateSession }}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </SessionContext.Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear();
    mockCreateSession.mockClear();
  });

  it('Carga la pantalla de login', () => {
    renderWithContext();
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  });

  it('Se escoge registrarse', () => {
    renderWithContext();
    fireEvent.click(screen.getByText('Signup'));
    expect(screen.getByTestId('signup-title')).toBeInTheDocument();
  });

  it('Error si los campos estan vacios', async () => {
    renderWithContext();
    fireEvent.click(screen.getByTestId('login-button'));
    await waitFor(() => screen.getByText(/Please complete all fields/i));
    expect(screen.getByText(/Please complete all fields/i)).toBeInTheDocument();
  });

  it('Se loggea y muestra mensaje si funciona el LLM', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, REACT_APP_API_ENDPOINT: 'http://localhost:8000', REACT_APP_LLM_API_KEY: 'test-key' };

    mock.onPost('http://localhost:8000/login').reply(200, { createdAt: '2025-01-01T00:00:00Z' });
    mock.onPost('http://localhost:8000/askllm').reply(200, { answer: '¡Hola estudiante de Oviedo!' });

    renderWithContext();
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => screen.getByText(/Hola estudiante de Oviedo/i));
    expect(screen.getByText(/Hola estudiante de Oviedo/i)).toBeInTheDocument();
    expect(localStorage.getItem('username')).toBe('testuser');
    expect(mockCreateSession).toHaveBeenCalledWith('testuser');

    process.env = originalEnv;
  });

  it('Muestra error con password incorrecta', async () => {
    renderWithContext();
    fireEvent.click(screen.getByText('Signup'));
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'abcd' } });
    fireEvent.click(screen.getByTestId('signup-button'));
    await waitFor(() => screen.getByText(/Passwords do not match/i));
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('Registro exitoso', async () => {
    mock.onPost('http://localhost:8000/adduser').reply(200);

    renderWithContext();
    fireEvent.click(screen.getByText('Signup'));
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user123' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByTestId('signup-button'));

    await waitFor(() => screen.getByText(/Registration successful/i));
    expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
  });
});