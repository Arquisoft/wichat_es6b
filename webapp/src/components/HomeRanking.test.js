import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomeRanking from './HomeRanking';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPlayers = [
  { username: 'Ana', totalPoints: 150 },
  { username: 'Luis', totalPoints: 140 },
  { username: 'María', totalPoints: 130 },
  { username: 'Pedro', totalPoints: 120 },
  { username: 'Clara', totalPoints: 110 },
  { username: 'Juan', totalPoints: 100 }, // Este debe ser excluido
];

describe('HomeRanking component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el loader mientras se cargan los datos', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<HomeRanking />, { wrapper: MemoryRouter });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('muestra el top 5 del ranking', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPlayers });

    render(<HomeRanking />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Luis')).toBeInTheDocument();
      expect(screen.queryByText('Juan')).toBeNull(); // No aparece
    });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(6); // 1 header + 5 jugadores
  });

  it('navega al ranking completo al hacer clic', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPlayers });

    render(<HomeRanking />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Ana'));

    const button = screen.getByRole('button', { name: /Ver Ranking Completo/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/ranking');
  });
});
