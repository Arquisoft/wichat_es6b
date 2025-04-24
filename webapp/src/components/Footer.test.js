import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Footer from './Footer';


describe('Footer component', () => {
    it('should render elements', async () => {
        render(
            <Footer />
        );
        await screen.findByText(/© WICHAT-ES6B/);
    
        const link1 = screen.getByText(/© WICHAT-ES6B/);
        await expect(link1).toBeInTheDocument();
    
        const link2 = screen.getByText(/API de preguntas/);
        await expect(link2).toBeInTheDocument();
    
        const link3 = screen.getByText(/API del historial/);
        await expect(link3).toBeInTheDocument();

        const link4 = screen.getByText(/API de usuarios/);
        await expect(link4).toBeInTheDocument();
    
      });
    
    });