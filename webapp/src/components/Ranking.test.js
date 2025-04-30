import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Ranking from './Ranking';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockRankings = [
  { username: 'Ana', totalPoints: 150, totalGames: 3, efficiency: 85 },
  { username: 'Luis', totalPoints: 140, totalGames: 4, efficiency: 65 },
  { username: 'María', totalPoints: 130, totalGames: 5, efficiency: 25 },
];

describe('Ranking component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra loader durante la carga', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    render(<Ranking />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Cargando ranking/i)).toBeInTheDocument();
  });

  it('muestra error si falla la carga', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    render(<Ranking />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el ranking/i)).toBeInTheDocument();
    });
  });

  it('muestra correctamente el ranking', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRankings });

    render(<Ranking />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Ranking de Jugadores')).toBeInTheDocument();
    });

    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luis')).toBeInTheDocument();
    expect(screen.getByText('María')).toBeInTheDocument();

    expect(screen.getAllByText(/%/)).toHaveLength(3); // 3 círculos de eficiencia
  });

  it('navega hacia atrás al hacer clic en el botón', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRankings });

    render(<Ranking />, { wrapper: MemoryRouter });

    await waitFor(() => screen.getByText('Ana'));

    const backButton = screen.getByRole('button', { name: /Volver Atrás/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
