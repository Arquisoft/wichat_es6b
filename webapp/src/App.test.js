import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test('renders welcome message', async () => {
  render(<App />);

  await waitFor(() => {
      expect(screen.getByText(/Welcome to the 2025 edition of the Wichat game/i)).toBeInTheDocument();
  });
});

test('renders login form by default', () => {
  render(<App />);
  expect(screen.getByText(/Don't have an account\? Register here./i)).toBeInTheDocument();
});

test('allows switching between login and register', async () => {
  render(<App />);
  const registerLink = screen.getByText(/Don't have an account\? Register here./i);
  await userEvent.click(registerLink);
  expect(screen.getByText(/Already have an account\? Login here./i)).toBeInTheDocument();
});
/*
test('renders game page', async () => {
  // Simula la navegación a la página del juego
  window.location.assign('/game');
  render(<App />);
  await waitFor(() => screen.getByText(/Game Component/i));
  expect(screen.getByText(/Game Component/i)).toBeInTheDocument();
});

test('renders ranking page', async () => {
  // Simula la navegación a la página de ranking
  window.location.assign('/ranking');
  render(<App />);
  await waitFor(() => screen.getByText(/Ranking Component/i));
  expect(screen.getByText(/Ranking Component/i)).toBeInTheDocument();
});

test('renders user profile page', async () => {
  // Simula la navegación a la página de perfil de usuario
  window.location.assign('/profile');
  render(<App />);
  await waitFor(() => screen.getByText(/User Profile/i));
  expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
});
*/