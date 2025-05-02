import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionContext, SessionProvider } from './SessionContext';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter } from 'react-router-dom';

// Mock de uuid
jest.mock('uuid', () => ({ v4: jest.fn() }));

// Configuración de las flags futuras de React Router
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('SessionContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        // Configuramos el mock para devolver 'mocked-uuid'
        uuidv4.mockReturnValue('mocked-uuid');
    });

    const TestComponent = () => {
        const { sessionId, username, isLoggedIn, avatar, createSession, destroySession, updateAvatar } = React.useContext(SessionContext);
        
        return (
            <div>
                <div data-testid="session-id">{sessionId}</div>
                <div data-testid="username">{username}</div>
                <div data-testid="is-logged-in">{isLoggedIn.toString()}</div>
                <div data-testid="avatar">{avatar}</div>
                <button onClick={() => createSession('testuser')}>Crear Sesión</button>
                <button onClick={destroySession}>Destruir Sesión</button>
                <button onClick={() => updateAvatar('/new-avatar.jpg')}>Actualizar Avatar</button>
            </div>
        );
    };

    const renderWithContext = () => {
        return render(
            <SessionProvider>
                <BrowserRouter {...routerConfig}>
                    <TestComponent />
                </BrowserRouter>
            </SessionProvider>
        );
    };

    it('should initialize with default values when no session exists', () => {
        renderWithContext();
        expect(screen.getByTestId('session-id')).toHaveTextContent('');
        expect(screen.getByTestId('username')).toHaveTextContent('');
        expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
        expect(screen.getByTestId('avatar')).toHaveTextContent('/default_user.jpg');
    });

    it('should create a new session and store it in localStorage', async () => {
        const { rerender } = renderWithContext();
        fireEvent.click(screen.getByText('Crear Sesión'));
        
        expect(uuidv4).toHaveBeenCalled();

        await waitFor(() => {
            expect(localStorage.getItem('sessionId')).toBe('mocked-uuid');
        });

        rerender(
            <SessionProvider>
                <BrowserRouter {...routerConfig}>
                    <TestComponent />
                </BrowserRouter>
            </SessionProvider>
        );

        expect(screen.getByTestId('session-id')).toHaveTextContent('mocked-uuid');
        expect(screen.getByTestId('username')).toHaveTextContent('testuser');
        expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
        expect(screen.getByTestId('avatar')).toHaveTextContent('/white.png');
    });

    it('should destroy session and clear localStorage when logout', async () => {
        localStorage.setItem('sessionId', 'test-session');
        localStorage.setItem('username', 'testuser');
        localStorage.setItem('avatar', '/test-avatar.jpg');

        const { rerender } = renderWithContext();
        fireEvent.click(screen.getByText('Destruir Sesión'));

        await waitFor(() => {
            expect(localStorage.getItem('sessionId')).toBeNull();
        });

        rerender(
            <SessionProvider>
                <BrowserRouter {...routerConfig}>
                    <TestComponent />
                </BrowserRouter>
            </SessionProvider>
        );

        expect(screen.getByTestId('session-id')).toHaveTextContent('');
        expect(screen.getByTestId('username')).toHaveTextContent('');
        expect(screen.getByTestId('is-logged-in')).toHaveTextContent('false');
        expect(screen.getByTestId('avatar')).toHaveTextContent('/white.png');
    });

    it('should update avatar and store it in localStorage', async () => {
        const { rerender } = renderWithContext();
        fireEvent.click(screen.getByText('Actualizar Avatar'));

        await waitFor(() => {
            expect(localStorage.getItem('avatar')).toBe('/new-avatar.jpg');
        });

        rerender(
            <SessionProvider>
                <BrowserRouter {...routerConfig}>
                    <TestComponent />
                </BrowserRouter>
            </SessionProvider>
        );

        expect(screen.getByTestId('avatar')).toHaveTextContent('/new-avatar.jpg');
    });

    it('should restore session from localStorage on mount', async () => {
        localStorage.setItem('sessionId', 'test-session');
        localStorage.setItem('username', 'testuser');
        localStorage.setItem('avatar', '/test-avatar.jpg');

        renderWithContext();

        expect(screen.getByTestId('session-id')).toHaveTextContent('test-session');
        expect(screen.getByTestId('username')).toHaveTextContent('testuser');
        expect(screen.getByTestId('is-logged-in')).toHaveTextContent('true');
        expect(screen.getByTestId('avatar')).toHaveTextContent('/test-avatar.jpg');
    });
});
