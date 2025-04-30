import React from 'react';
import { render, screen} from '@testing-library/react';
import Footer from './Footer';


describe('Footer component', () => {
    it('should render elements', async () => { 
        render(
            <Footer />
        );
        //Comprobamos que esten los enlaces en el footer
        await screen.findByText(/© WICHAT-ES6B/); 
  
        //const link1 = screen.getByText(/© WICHAT-ES6B/);
        //await expect(link1).toBeInTheDocument();
        await expect(screen.getByText(/© WICHAT-ES6B/)).toBeInTheDocument();
    
        // const link2 = screen.getByText(/API de preguntas/);
        // await expect(link2).toBeInTheDocument();
        await expect(screen.getByText(/API de preguntas/)).toBeInTheDocument();
    
        // const link3 = screen.getByText(/API del historial/);
        // await expect(link3).toBeInTheDocument();
        await expect(screen.getByText(/API del historial/)).toBeInTheDocument();

        // const link4 = screen.getByText(/API de usuarios/);
        // await expect(link4).toBeInTheDocument();
        await expect(screen.getByText(/API de usuarios/)).toBeInTheDocument();
      });
    
    });