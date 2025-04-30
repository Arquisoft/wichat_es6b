const request = require('supertest');
const axios = require('axios');
const server = require('./questions');

jest.mock('axios');

afterAll(() => {
  server.close();
});

describe('Question Service', () => {
  beforeEach(() => {
    // Mock de la respuesta de Wikidata
    axios.get.mockImplementation((url) => {
      if (url === 'https://query.wikidata.org/sparql') {
        return Promise.resolve({
          data: {
            results: {
              bindings: [
                { optionLabel: { value: 'Lionel Messi' }, imageLabel: { value: 'https://example.com/messi.jpg' } },
                { optionLabel: { value: 'Cristiano Ronaldo' }, imageLabel: { value: 'https://example.com/ronaldo.jpg' } },
                { optionLabel: { value: 'Neymar' }, imageLabel: { value: 'https://example.com/neymar.jpg' } },
                { optionLabel: { value: 'Kylian Mbappé' }, imageLabel: { value: 'https://example.com/mbappe.jpg' } },
              ],
            },
          },
        });
      }
      return Promise.reject(new Error('URL no válida'));
    });
  });

  it('should generate a question successfully', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('responseQuestion');
    expect(response.body).toHaveProperty('responseOptions');
    expect(response.body).toHaveProperty('responseCorrectOption');
    expect(response.body).toHaveProperty('responseImage');
  });

  it('should handle invalid thematic', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'InvalidThematic', language: 'es' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle invalid language', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'invalid' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle Wikidata API error', async () => {
    axios.get.mockImplementationOnce(() => {
      throw new Error('Wikidata API error');
    });

    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should generate questions in English', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'en' });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseQuestion).toBe('What is the name of this footballer?');
  });

  it('should generate questions in Spanish', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseQuestion).toBe('¿Cuál es el nombre de este futbolista?');
  });

  it('should return exactly 4 options', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseOptions.length).toBe(4);
  });

  it('should have one correct answer among options', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseOptions).toContain(response.body.responseCorrectOption);
  });
});
