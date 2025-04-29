import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlipCard from './FlipCard';

// Mocks para los componentes hijos
jest.mock('./Login', () => () => <div>Login Component</div>);
jest.mock('./AddUser', () => () => <div>AddUser Component</div>);

describe('FlipCard component', () => {
  it('muestra el componente Login por defecto', () => {
    render(<FlipCard />);
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\? Register here\./i)).toBeInTheDocument();
  });

  it('da la vuelta a la tarjeta al hacer clic en "Register here"', () => {
    render(<FlipCard />);
    
    const flipButton = screen.getByRole('button', { name: /Don't have an account\? Register here\./i });
    fireEvent.click(flipButton);

    expect(screen.getByText(/AddUser Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\? Login here\./i)).toBeInTheDocument();
  });

  it('vuelve a mostrar Login al hacer clic en "Login here"', () => {
    render(<FlipCard />);
    
    // Ir a la parte trasera
    fireEvent.click(screen.getByText(/Register here/i));

    // Volver a la parte delantera
    fireEvent.click(screen.getByText(/Login here/i));

    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });
});