const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

// Test-only credentials (not real passwords)
const TEST_USER_PASSWORD = 'testpassword';
const WRONG_USER_PASSWORD = 'wrongpass';
const NEW_USER_PASSWORD = 'newpassword';
const DUPLICATE_USER_PASSWORD = 'password';

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Dar tiempo para que las conexiones se cierren
  await app.close();
});

jest.mock('axios');

describe('Gateway Service', () => {
  // Constante para la contraseña de prueba
  const TEST_PASSWORD = 'test_password_123';

  // Mock responses from external services
  axios.get.mockImplementation((url) => {
    if (url.includes('/stats/')) {
      return Promise.resolve({ data: { totalGames: 10, averageScore: 75 } });
    } else if (url.endsWith('/rankings')) {
      return Promise.resolve({ data: [{ username: 'user1', score: 100 }] });
    } else if (url.includes('/history/')) {
      return Promise.resolve({ data: [{ gameId: 'game1', score: 80 }] });
    } else if (url.endsWith('/generateQuestion')) {
      return Promise.resolve({ 
        data: { 
          responseQuestion: 'Test question',
          responseOptions: ['A', 'B', 'C', 'D'],
          responseCorrectOption: 'A',
          responseImage: 'test.jpg'
        } 
      });
    }
  });

  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url.endsWith('/ask')) {
      return Promise.resolve({ data: { answer: 'llmanswer' } });
    } else if (url.endsWith('/savegame')) {
      return Promise.resolve({ data: { gameId: 'mockedGameId' } });
    }
  });

  //Login correcto
  describe('Login Endpoint', () => {
    it('should forward login request to auth service successfully', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: TEST_USER_PASSWORD });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBe('mockedToken');
    });
    
    //Login incorrecto
    it('should handle login failure', async () => {
      axios.post.mockImplementationOnce(() => {
        throw { response: { status: 401, data: { error: 'Invalid credentials' } } };
      });

      const response = await request(app)
        .post('/login')
        .send({ username: 'wronguser', password: WRONG_USER_PASSWORD });

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  //Add User Endpoint
  describe('Add User Endpoint', () => {
    it('should forward add user request to user service successfully', async () => {
      const response = await request(app)
        .post('/adduser')
        .send({ username: 'newuser', password: NEW_USER_PASSWORD });

      expect(response.statusCode).toBe(200);
      expect(response.body.userId).toBe('mockedUserId');
    });

    it('should handle duplicate username error', async () => {
      axios.post.mockImplementationOnce(() => {
        throw { response: { status: 400, data: { error: 'Username already exists' } } };
      });

      const response = await request(app)
        .post('/adduser')
        .send({ username: 'existinguser', password: DUPLICATE_USER_PASSWORD });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Username already exists');
    });
  });
  
  describe('Ask LLM Endpoint', () => {
    it('should forward askllm request to the llm service successfully', async () => {
      const response = await request(app)
        .post('/askllm')
        .send({ question: 'question', apiKey: 'apiKey', model: 'gemini' });

      expect(response.statusCode).toBe(200);
      expect(response.body.answer).toBe('llmanswer');
    });

    it('should handle LLM service error', async () => {
      axios.post.mockImplementationOnce(() => {
        throw { response: { status: 500, data: { error: 'LLM service error' } } };
      });

      const response = await request(app)
        .post('/askllm')
        .send({ question: 'question', apiKey: 'invalidKey', model: 'gemini' });

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('LLM service error');
    });
  });

  describe('Health Endpoint', () => {
    it('should return health status successfully', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Stats Endpoint', () => {
    it('should forward stats request to history service successfully', async () => {
      const response = await request(app)
        .get('/stats/testuser');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalGames');
      expect(response.body).toHaveProperty('averageScore');
    });

    it('should handle stats service error', async () => {
      axios.get.mockImplementationOnce(() => {
        throw { response: { status: 404, data: { error: 'User not found' } } };
      });

      const response = await request(app)
        .get('/stats/nonexistentuser');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('Rankings Endpoint', () => {
    it('should forward rankings request to history service successfully', async () => {
      const response = await request(app)
        .get('/rankings');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).toHaveProperty('score');
    });

    it('should handle rankings service error', async () => {
      axios.get.mockImplementationOnce(() => {
        throw { response: { status: 500, data: { error: 'Database error' } } };
      });

      const response = await request(app)
        .get('/rankings');

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('History Endpoint', () => {
    it('should forward history request to history service successfully', async () => {
      const response = await request(app)
        .get('/history/testuser');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('gameId');
      expect(response.body[0]).toHaveProperty('score');
    });

    it('should handle history service error', async () => {
      axios.get.mockImplementationOnce(() => {
        throw { response: { status: 404, data: { error: 'No history found' } } };
      });

      const response = await request(app)
        .get('/history/nonexistentuser');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('No history found');
    });
  });

  describe('Save Game Endpoint', () => {
    it('should forward savegame request to history service successfully', async () => {
      const gameData = {
        username: 'testuser',
        score: 80,
        questions: []
      };

      const response = await request(app)
        .post('/savegame')
        .send(gameData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('gameId');
    });

    it('should handle savegame service error', async () => {
      axios.post.mockImplementationOnce(() => {
        throw { response: { status: 400, data: { error: 'Invalid game data' } } };
      });

      const invalidGameData = {
        username: 'testuser',
        // Missing required fields
      };

      const response = await request(app)
        .post('/savegame')
        .send(invalidGameData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid game data');
    });
  });

  describe('Generate Questions Endpoint', () => {
    it('should forward generateQuestions request to questions service successfully', async () => {
      const response = await request(app)
        .get('/generateQuestions')
        .query({ language: 'es', thematic: 'Geografia' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('responseQuestion');
      expect(response.body).toHaveProperty('responseOptions');
      expect(response.body).toHaveProperty('responseCorrectOption');
      expect(response.body).toHaveProperty('responseImage');
    });

    it('should handle generateQuestions service error', async () => {
      axios.get.mockImplementationOnce(() => {
        throw { response: { status: 400, data: { error: 'Invalid thematic' } } };
      });

      const response = await request(app)
        .get('/generateQuestions')
        .query({ language: 'es', thematic: 'InvalidThematic' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid thematic');
    });
  });
});

