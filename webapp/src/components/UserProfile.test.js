import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserProfile from './UserProfile';

const mockAxios = new MockAdapter(axios);
const mockNavigate = jest.fn();

// Configuración de las flags futuras de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'testuser' })
}));

// Tests separados por funcionalidad
describe('UserProfile - Estado inicial', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('muestra mensaje de carga al inicio', () => {
    mockAxios.onGet().reply(200, {});
    render(
      <MemoryRouter {...routerConfig}>
        <UserProfile />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando perfil...')).toBeInTheDocument();
  });

  it('redirige a inicio si no hay usuario autenticado', async () => {
    localStorage.removeItem('username');
    render(
      <MemoryRouter {...routerConfig}>
        <UserProfile />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

describe('UserProfile - Estadísticas', () => {
    const mockStats = { totalGames: 5, totalPoints: 100, averageTime: 25 };
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  
    beforeEach(() => {
      localStorage.setItem('username', 'testuser');
      mockAxios.reset();
      // Mock both required endpoints
      mockAxios.onGet(`${apiEndpoint}/stats/testuser`).reply(200, mockStats);
      mockAxios.onGet(`${apiEndpoint}/history/testuser`).reply(200, []);
    });
  
    it('muestra total de partidas jugadas', async () => {
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        const totalGames = screen.getByText('Partidas Jugadas');
        expect(totalGames.nextSibling).toHaveTextContent('5');
      });
    });
  
    it('muestra puntos totales', async () => {
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        const totalPoints = screen.getByText('Puntos Totales');
        expect(totalPoints.nextSibling).toHaveTextContent('100');
      });
    });
  
    it('muestra tiempo promedio', async () => {
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        const avgTime = screen.getByText('Tiempo Promedio');
        expect(avgTime.nextSibling).toHaveTextContent('25s');
      });
    });
  
    it('maneja errores de la API correctamente', async () => {
      mockAxios.reset();
      mockAxios.onGet(`${apiEndpoint}/stats/testuser`).reply(404, { error: 'User not found' });
      
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    });
  });

  describe('UserProfile - Historial de juegos', () => {
    const mockGame = {
      id: 'game1',
      points: 50,
      avgtime: 20,
      createdAt: '2024-03-20T10:00:00.000Z',
      questions: [
        {
          question: '¿Pregunta 1?',
          correct: true,
          timeSpent: 15
        }
      ]
    };
  
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  
    beforeEach(() => {
      localStorage.setItem('username', 'testuser');
      mockAxios.reset();
      // Mock stats endpoint to prevent 404
      mockAxios.onGet(`${apiEndpoint}/stats/testuser`).reply(200, {
        totalGames: 0,
        totalPoints: 0,
        averageTime: 0
      });
    });
  
    it('muestra mensaje cuando no hay juegos', async () => {
      // Mock history endpoint with empty array
      mockAxios.onGet(`${apiEndpoint}/history/testuser`).reply(200, []);
      
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText('No hay juegos registrados aún.')).toBeInTheDocument();
      });
    });
  
    it('muestra detalles básicos de una partida', async () => {
      // Mock history endpoint with game data
      mockAxios.onGet(`${apiEndpoint}/history/testuser`).reply(200, [mockGame]);
      
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        const points = screen.getByText('Puntos:');
        const time = screen.getByText('Tiempo promedio:');
        expect(points.nextSibling).toHaveTextContent('50');
        expect(time.nextSibling).toHaveTextContent('20s');
      });
    });
  
    it('maneja errores al cargar el historial', async () => {
      mockAxios.onGet(`${apiEndpoint}/history/testuser`).reply(404, { 
        error: 'History not found' 
      });
      
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
      });
    });
  });

  describe('UserProfile - Navegación', () => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    
    beforeEach(() => {
      localStorage.setItem('username', 'testuser');
      mockAxios.reset();
      jest.clearAllMocks();
  
      // Mock required endpoints
      mockAxios.onGet(`${apiEndpoint}/stats/testuser`).reply(200, {
        totalGames: 0,
        totalPoints: 0,
        averageTime: 0
      });
      mockAxios.onGet(`${apiEndpoint}/history/testuser`).reply(200, []);
    });
  
    it('navega a /game al hacer clic en Jugar', async () => {
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
  
      // Wait for data to load before looking for button
      await waitFor(() => {
        const button = screen.getByText(/Jugar Nueva Partida/i);
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/game');
      });
    });
  
    it('navega a /ranking al hacer clic en Rankings', async () => {
      render(
        <MemoryRouter {...routerConfig}>
          <UserProfile />
        </MemoryRouter>
      );
  
      // Wait for data to load before looking for button
      await waitFor(() => {
        const button = screen.getByText(/Ver Rankings/i);
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/ranking');
      });
    });
  });