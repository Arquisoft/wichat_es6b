import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameSettings from './GameSettings';
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('GameSettings component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  it('renderiza las opciones de dificultad y categorías', () => {
    render(<GameSettings />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Fácil/i)).toBeInTheDocument();
    expect(screen.getByText(/Medio/i)).toBeInTheDocument();
    expect(screen.getByText(/Difícil/i)).toBeInTheDocument();

    expect(screen.getByText(/Geografia/i)).toBeInTheDocument();
    expect(screen.getByText(/Cultura/i)).toBeInTheDocument();
    expect(screen.getByText(/Futbolistas/i)).toBeInTheDocument();
  });

  it('guarda la dificultad seleccionada en localStorage', () => {
    render(<GameSettings />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('Medio'));
    expect(localStorage.getItem('gameDifficulty')).toBe('Medio');
  });

  it('selecciona y deselecciona categorías', () => {
    render(<GameSettings />, { wrapper: MemoryRouter });

    const cultura = screen.getByText('Cultura');
    fireEvent.click(cultura); // Deseleccionar
    fireEvent.click(cultura); // Volver a seleccionar

    fireEvent.click(screen.getByText(/Guardar y jugar/i));
    //const stored = JSON.parse(localStorage.getItem('selectedCategories'));
    //expect(stored).toContain('Cultura');
  });

  it('guarda y navega al hacer clic en "Guardar y salir"', () => {
    render(<GameSettings />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/Guardar y salir/i));
    //expect(localStorage.getItem('gameDifficulty')).toBeTruthy();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('guarda y navega al hacer clic en "Guardar y jugar"', () => {
    render(<GameSettings />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/Guardar y jugar/i));
    expect(localStorage.getItem('selectedCategories')).toBeTruthy();
    expect(mockNavigate).toHaveBeenCalledWith('/game');
  });
});
