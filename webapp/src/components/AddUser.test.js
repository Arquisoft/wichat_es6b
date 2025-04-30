import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';
import { MemoryRouter } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext'; // Import the SessionContext

const mockAxios = new MockAdapter(axios);

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    const createSession = jest.fn();
    render(
      <SessionContext.Provider value={{ createSession }}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });

  it('should not call the API if username is empty', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    // Ensure the API call was not made
    expect(mockAxios.history.post.length).toBe(0);
  });

  it('should not call the API if password is empty', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: 'validUser' } });
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    // Ensure the API call was not made
    expect(mockAxios.history.post.length).toBe(0);
  });

  it('should clear the validation error message after valid input', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <MemoryRouter>
          <AddUser />
        </MemoryRouter>
      </SessionContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Trigger a validation error
    fireEvent.click(addUserButton);
    await waitFor(() => {
      expect(screen.getByText(/Both username and password are required/i)).toBeInTheDocument();
    });

    // Now provide valid input
    fireEvent.change(usernameInput, { target: { value: 'validUser' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(addUserButton);

    // Wait for a short time to see if the error message disappears (adjust timeout if needed)
    await waitFor(() => {
      expect(screen.queryByText(/Both username and password are required/i)).not.toBeInTheDocument();
    }, { timeout: 100 });
  });
});