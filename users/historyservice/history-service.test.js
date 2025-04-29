const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Game = require('./history-model');
const server = require('./history-service'); // Importa el servidor

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(); // Cierra el servidor después de las pruebas
});

beforeEach(async () => {
  await Game.deleteMany({}); // Limpia la base de datos antes de cada prueba
});

describe('History Service API Tests', () => {
  it('should save a new game record', async () => {
    const newGameData = {
      id: 'game123',
      username: 'testuser',
      points: 100,
      avgtime: 30,
      questions: [
        { question: 'Q1', answer: 'A1', correct: true },
        { question: 'Q2', answer: 'A2', correct: false },
      ],
    };

    const response = await request(server)
      .post('/savegame')
      .send(newGameData)
      .expect(201);

    expect(response.body.id).toBe(newGameData.id);
    expect(response.body.username).toBe(newGameData.username);
    expect(response.body.points).toBe(newGameData.points);
    expect(response.body.avgtime).toBe(newGameData.avgtime);
    expect(response.body.questions).toEqual(newGameData.questions);

    const gameInDb = await Game.findOne({ id: newGameData.id });
    expect(gameInDb).toBeDefined();
    expect(gameInDb.username).toBe(newGameData.username);
  });

  it('should return 400 if required fields are missing when saving a game', async () => {
    const invalidGameData = {
      username: 'testuser',
      points: 100,
    };

    const response = await request(server)
      .post('/savegame')
      .send(invalidGameData)
      .expect(400);

    expect(response.body.error).toBe('Missing required field: id');
  });

  it('should get the game history for a user', async () => {
    const game1 = { id: 'game1', username: 'testuser', points: 50, avgtime: 20, questions: [] };
    const game2 = { id: 'game2', username: 'anotheruser', points: 75, avgtime: 25, questions: [] };
    const game3 = { id: 'game3', username: 'testuser', points: 120, avgtime: 35, questions: [] };

    await Game.insertMany([game1, game2, game3]);

    const response = await request(server)
      .get('/history/testuser')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toBe('game3'); // Debería estar ordenado por createdAt descendente
    expect(response.body[1].id).toBe('game1');
  });

  it('should return an empty array if no history found for a user', async () => {
    const response = await request(server)
      .get('/history/nonexistentuser')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  describe('GET /stats/:username', () => {
    it('should get the summarized statistics for a user', async () => {
      const game1 = { username: 'testuser', points: 50, avgtime: 20, questions: [{ correct: true }, { correct: false }] };
      const game2 = { username: 'testuser', points: 75, avgtime: 30, questions: [{ correct: true }, { correct: true }] };
      const game3 = { username: 'anotheruser', points: 100, avgtime: 40, questions: [{ correct: true }, { correct: false }] };

      await Game.insertMany([game1, game2, game3]);

      const response = await request(server)
        .get('/stats/testuser')
        .expect(200);

      expect(response.body).toEqual({
        username: 'testuser',
        totalGames: 2,
        totalPoints: 125,
        correctAnswers: 3,
        wrongAnswers: 1,
        averageTime: 25,
      });
    });

    it('should return default statistics if no games found for a user', async () => {
      const response = await request(server)
        .get('/stats/nonexistentuser')
        .expect(200);

      expect(response.body).toEqual({
        username: 'nonexistentuser',
        totalGames: 0,
        totalPoints: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageTime: 0,
      });
    });

    it('should handle games with no questions correctly', async () => {
      const game1 = { username: 'testuser', points: 50, avgtime: 20, questions: [] };
      await Game.insertMany([game1]);

      const response = await request(server)
        .get('/stats/testuser')
        .expect(200);

      expect(response.body).toEqual({
        username: 'testuser',
        totalGames: 1,
        totalPoints: 50,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageTime: 20,
      });
    });
  });

  describe('GET /rankings', () => {
    it('should get the top 10 players by total points', async () => {
      const gameData = [
        { username: 'user1', points: 100 },
        { username: 'user2', points: 150 },
        { username: 'user3', points: 80 },
        { username: 'user4', points: 200 },
        { username: 'user5', points: 120 },
        { username: 'user6', points: 90 },
        { username: 'user7', points: 180 },
        { username: 'user8', points: 70 },
        { username: 'user9', points: 220 },
        { username: 'user10', points: 110 },
        { username: 'user11', points: 160 }, // Más de 10 para probar el límite
      ];
      await Game.insertMany(gameData.map(data => ({ ...data, avgtime: 10, questions: [] })));

      const response = await request(server)
        .get('/rankings')
        .expect(200);

      expect(response.body).toHaveLength(10);
      expect(response.body[0].username).toBe('user9');
      expect(response.body[0].totalPoints).toBe(220);
      // ... otros usuarios en orden descendente de puntos
      const points = response.body.map(user => user.totalPoints);
      for (let i = 0; i < points.length - 1; i++) {
        expect(points[i]).toBeGreaterThanOrEqual(points[i + 1]);
      }
    });

    it('should calculate efficiency correctly', async () => {
      const game1 = { username: 'user1', points: 100, avgtime: 10, questions: [] };
      const game2 = { username: 'user1', points: 50, avgtime: 10, questions: [] };
      await Game.insertMany([game1, game2]);

      const response = await request(server)
        .get('/rankings')
        .expect(200);

      const user1Ranking = response.body.find(user => user.username === 'user1');
      expect(user1Ranking).toBeDefined();
      expect(user1Ranking.totalPoints).toBe(150);
      expect(user1Ranking.totalGames).toBe(2);
      expect(user1Ranking.efficiency).toBe(75); // (150 / (2 * 100)) * 100 = 75
    });

    it('should return an empty array if no games have been played', async () => {
      const response = await request(server)
        .get('/rankings')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  it('should serve the Swagger UI documentation', async () => {
    const response = await request(server)
      .get('/api-docs')
      .expect(200)
      .expect('Content-Type', /html/);
    expect(response.text).toContain('Swagger UI');
  });
});