import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Dashboard from './Dashboard';
import { SessionContext } from '../context/SessionContext';

const mockAxios = new MockAdapter(axios);

// Mock de useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('Dashboard component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('navega a las rutas correctas cuando se hace clic en los botones', async () => {
    const testUsername = 'Pablo';

    mockAxios.onPost('http://localhost:8000/askllm').reply(200, { answer: 'Hola Pablo' });

    render(
      <SessionContext.Provider value={{ username: testUsername }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Jugar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/game');

    fireEvent.click(screen.getByRole('button', { name: /Ver Rankings/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/ranking');

    fireEvent.click(screen.getByRole('button', { name: /Ver mi perfil/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`/profile/${testUsername}`);
  });
});
