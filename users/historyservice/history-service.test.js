const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Game = require('./history-model');
const server = require('./history-service'); 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState === 1 && mongoose.connection.uri !== mongoUri) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close(); 
});

beforeEach(async () => {
  await Game.deleteMany({}); 
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

    expect(response.body.questions.map(q => ({ question: q.question, correct: q.correct }))).toEqual(newGameData.questions.map(q => ({ question: q.question, correct: q.correct })));

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
    const game1 = { id: 'game1', username: 'testuser', points: 50, avgtime: 20, questions: [] , createdAt: new Date('2025-04-29T18:00:00.000Z')};
    const game2 = { id: 'game2', username: 'anotheruser', points: 75, avgtime: 25, questions: [], createdAt: new Date('2025-04-29T18:10:00.000Z') };
    const game3 = { id: 'game3', username: 'testuser', points: 120, avgtime: 35, questions: [], createdAt: new Date('2025-04-29T18:20:00.000Z') };

    await Game.insertMany([game1, game2, game3]);

    const response = await request(server)
      .get('/history/testuser')
      .expect(200);

    expect(response.body).toHaveLength(2);

    expect(response.body[1].id).toBe('game1');
    expect(response.body[0].id).toBe('game3');
  });

  it('should return an empty array if no history found for a user', async () => {
    const response = await request(server)
      .get('/history/nonexistentuser')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  describe('GET /stats/:username', () => {
    it('should get the summarized statistics for a user', async () => {
      const game1 = {
        id: 'st1',
        username: 'testuser',
        points: 50,
        avgtime: 20,
        questions: [{ correct: true }, { correct: false }],
      };
      const game2 = {
        id: 'st2',
        username: 'testuser',
        points: 75,
        avgtime: 30,
        questions: [{ correct: true }, { correct: true }],
      };
      const game3 = {
        id: 'st3',
        username: 'anotheruser',
        points: 100,
        avgtime: 40,
        questions: [{ correct: true }, { correct: false }],
      };

      await Game.insertMany([game1, game2, game3]);

      const response = await request(server)
        .get('/stats/testuser')
        .expect(200);


      expect(response.body).toEqual({
        username: 'testuser',
        totalGames: 2,
        totalPoints: 125,
        correctAnswers: 0,
        wrongAnswers: 0,
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
      const game1 = { id: 'sq1', username: 'testuser', points: 50, avgtime: 20, questions: [] };
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
        { id: 'r1', username: 'user1', points: 100 },
        { id: 'r2', username: 'user2', points: 150 },
        { id: 'r3', username: 'user3', points: 80 },
        { id: 'r4', username: 'user4', points: 200 },
        { id: 'r5', username: 'user5', points: 120 },
        { id: 'r6', username: 'user6', points: 90 },
        { id: 'r7', username: 'user7', points: 180 },
        { id: 'r8', username: 'user8', points: 70 },
        { id: 'r9', username: 'user9', points: 220 },
        { id: 'r10', username: 'user10', points: 110 },
        { id: 'r11', username: 'user11', points: 160 },
      ];
      await Game.insertMany(gameData.map(data => ({ ...data, avgtime: 10, questions: [] })));

      const response = await request(server)
        .get('/rankings')
        .expect(200);

      expect(response.body).toHaveLength(10);

      const receivedUsernames = response.body.map(user => user.username);
      expect(receivedUsernames).toEqual(expect.arrayContaining(['user9', 'user4', 'user7', 'user11', 'user2', 'user5', 'user10', 'user1', 'user6', 'user3']));
      const points = response.body.map(user => user.totalPoints);

    });

    it('should calculate efficiency correctly', async () => {
      const game1 = { id: 'e1', username: 'user1', points: 100, avgtime: 10, questions: [] };
      const game2 = { id: 'e2', username: 'user1', points: 50, avgtime: 10, questions: [] };
      await Game.insertMany([game1, game2]);

      const response = await request(server)
        .get('/rankings')
        .expect(200);

      const user1Ranking = response.body.find(user => user.username === 'user1');
      expect(user1Ranking).toBeDefined();
      expect(user1Ranking.totalPoints).toBe(150);
      expect(user1Ranking.totalGames).toBe(2);
      expect(user1Ranking.efficiency).toBe(75);
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
      .get('/api-docs/') // Añade una barra al final
      .expect(200)
      .expect('Content-Type', /html/);
    expect(response.text).toContain('Swagger UI');
  });
});