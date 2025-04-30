import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';
import { SessionContext } from '../context/SessionContext';

// Mock window.location.reload
const mockReload = jest.fn(); //Simullación de reload para evitar recargar la pagina
Object.defineProperty(window, 'location', { //Con esto evitamos recargar la pagina realmente llamando al mockReload
  value: { reload: mockReload }
});

// Configuración de las flags futuras de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('NavBar component', () => {
    beforeEach(() => {
      // Limpiar todos los mocks antes de cada test
      jest.clearAllMocks();
    });

    //No loggeado se verá el logo
    it('should render logo when not logged', async () => {
      render(
        //Renderiamos el NavBar en un contexto de sesión vacío para simular que no está logueado
        //BrowserRouter para manejar las rutas
        <SessionContext.Provider value={{}}>
          <BrowserRouter {...routerConfig}> 
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      );
      const logo = screen.getByAltText('Logo'); //Buscamos el logo por su alt text
      await expect(logo).toBeInTheDocument(); 
    });

    //Usuario loggeado verá el logo
    it('should render logo when logged', async () => {
        render(
           //Renderiamos el NavBar en un contexto de sesión en el que el usuario está loggeado
          <SessionContext.Provider value={{ isLoggedIn: true }}>
            <BrowserRouter {...routerConfig}>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const logo = screen.getByAltText('Logo');
        // There should be the one for mobile and the one for normal devices
        await expect(logo).toBeInTheDocument();
      });
    
      //Comprobamos que el botón de login  se ve si el usuario no está loggeado
      it('should render log-in option', async () => {
        render(
          <SessionContext.Provider value={{}}>
            <BrowserRouter {...routerConfig}>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const logIn = screen.getByText('Log In');
        await expect(logIn).toBeInTheDocument();
      });

      //Comprobamos que se ven los links de navegación cuando el usuario está loggeado
      it('should render navigation links', async () => {
        render(
          <SessionContext.Provider value={{ isLoggedIn: true }}>
            <BrowserRouter {...routerConfig}>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const playLink = await screen.findByText('Jugar');
        expect(playLink).toBeInTheDocument();

        const rankingLink = screen.getByText('Ranking');
        expect(rankingLink).toBeInTheDocument();

        const gameSettings = screen.getByText('Ajustes de juego');
        expect(gameSettings).toBeInTheDocument();
      });

      //Comprobamos que el nombre de usuario se ve cuando el usuario está loggeado
      it('should render username logged and its menu', async () => {
        const username = "UserTest"
        render(
          //Renderiamos el NavBar en un contexto de sesión en el que el usuario está loggeado y su nombre de usuario es "UserTest"
          <SessionContext.Provider value={{ username: username, isLoggedIn: true }}>
            <BrowserRouter {...routerConfig}>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const menuButton = screen.getByLabelText('current user account'); //Buscamos el botón de menú por su aria-label
        fireEvent.click(menuButton); //simulamos click en el boton 
    
        const userDisplayed = screen.getByText(username);//Buscamos el nombre de usuario por su texto
        await expect(userDisplayed).toBeInTheDocument();
      });

      //Comprobamos que el botón de logout funciona
      it('should call handleLogout function when logout button is clicked', async () => {
        const mockDestroySession = jest.fn();
        render(
          //mockeamos mockDestroySession para simular la función de logout ( comprobar que se llama y recarga la pagina )
          <SessionContext.Provider value={{ isLoggedIn: true, destroySession: mockDestroySession }}> 
            <BrowserRouter {...routerConfig}>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
      
       //Buscamos el botón de logout por su data-testid
        const logoutButton = screen.getByTestId('logout-button'); 
        await expect(logoutButton).toBeInTheDocument();
      
        //simulamos click en el boton
        fireEvent.click(logoutButton); 
        
        //Veriffica que destroySession fue llamado
        expect(mockDestroySession).toHaveBeenCalled(); 
        
        //Verifica que la función de recarga fue llamada
        expect(mockReload).toHaveBeenCalled(); 
      });

  });