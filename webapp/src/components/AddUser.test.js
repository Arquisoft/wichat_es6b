import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';
import { MemoryRouter } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';

const mockAxios = new MockAdapter(axios);

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (sessionValue) => {
    return render(
      <SessionContext.Provider value={sessionValue}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );
  };

  it('should add user successfully', async () => {
    const createSession = jest.fn();
    renderComponent({ createSession });

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    renderComponent({});

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });

  it('should not call the API if username is empty', async () => {
    renderComponent({});

    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    expect(mockAxios.history.post.length).toBe(0);
  });

  it('should not call the API if password is empty', async () => {
    renderComponent({});

    const usernameInput = screen.getByLabelText(/Username/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: 'validUser' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    expect(mockAxios.history.post.length).toBe(0);
  });

  it('should clear the validation error message after valid input', async () => {
    renderComponent({});

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.click(addUserButton);
    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    fireEvent.change(usernameInput, { target: { value: 'validUser' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(screen.queryByText(/Both username and password are required/i)).not.toBeInTheDocument();
    }, { timeout: 100 });
  });
});