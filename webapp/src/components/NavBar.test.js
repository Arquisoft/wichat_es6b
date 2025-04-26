import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter  } from 'react-router-dom';
import NavBar from './NavBar';
import { SessionContext } from '../sessionContext'; 

describe('NavBar component', () => {
    it('should render logo when not logged', async () => {
      render(
        <SessionContext.Provider value={{}}>
          <BrowserRouter>
            <NavBar />
          </BrowserRouter>
        </SessionContext.Provider>
      );
      const logo = screen.getByAltText('Logo');
      await expect(logo).toBeInTheDocument();
    });

    it('should render logo when logged', async () => {
        render(
          <SessionContext.Provider value={{ isLoggedIn: true }}>
            <BrowserRouter>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const logo = screen.getByAltText('Logo');
        // There should be the one for mobile and the one for normal devices
        await expect(logo).toBeInTheDocument();
      });
    
      it('should render log-in option', async () => {
        render(
          <SessionContext.Provider value={{}}>
            <BrowserRouter>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const logIn = screen.getByText('Log In');
        await expect(logIn).toBeInTheDocument();
      });

      it('should render navigation links', async () => {
        render(
          <SessionContext.Provider value={{ isLoggedIn: true }}>
            <BrowserRouter>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
    const playLink= await screen.findByText('Jugar');
    expect(playLink).toBeInTheDocument();

    const rankingLink = screen.getByText('Ranking');
    expect(rankingLink).toBeInTheDocument();
    });

    it('should render username logged and its menu', async () => {
        const username = "UserTest"
        render(
          <SessionContext.Provider value={{ username: username, isLoggedIn: true }}>
            <BrowserRouter>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
        const menuButton = screen.getByLabelText('current user account');
        fireEvent.click(menuButton);
    
        const userDisplayed = screen.getByText(username);
        await expect(userDisplayed).toBeInTheDocument();
      });

      it('should call handleLogout function when logout button is clicked', async () => {
        render(
          <SessionContext.Provider value={{ isLoggedIn: true, destroySession: () => {} }}>
            <BrowserRouter>
              <NavBar />
            </BrowserRouter>
          </SessionContext.Provider>
        );
      
        // Find the logout button using data-testid
        const logoutButton = screen.getByTestId('logout-button');
        await expect(logoutButton).toBeInTheDocument();
      
        // Simulate a click on the logout button and check final route
        //TODO - check call to destroysession
        fireEvent.click(logoutButton);
        expect(window.location.pathname).toBe('/');
      });

  });