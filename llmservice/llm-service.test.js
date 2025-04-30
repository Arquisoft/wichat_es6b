const request = require('supertest');
const axios = require('axios');
const app = require('./llm-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('LLM Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.startsWith('https://generativelanguage')) {
      return Promise.resolve({ data: { candidates: [{ content: { parts: [{ text: 'llmanswer' }] } }] } });
    } else if (url.endsWith('https://empathyai')) {
      return Promise.resolve({ data: { answer: 'llmanswer' } });
    }
  });

  // Test /ask endpoint
  it('the llm should reply', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', apiKey: 'AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ', model: 'gemini', context:"Responde en español" });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });



  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'test', apiKey: 'AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ' , context:"Responde en español" }); // Falta 'model'
  
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing required field: model/);
  });

  it('should handle error when axios.post throws', async () => {
    axios.post.mockImplementationOnce(() => {
      throw new Error('network failure');
    });
  
    const response = await request(app)
      .post('/ask')
      .send({ question: 'test', apiKey: 'AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ', model: 'gemini' , context:"Responde en español" });
  
    expect(response.statusCode).toBe(400); 
  });
  

});  it('should return 400 if model is unsupported', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'test', apiKey: 'AIzaSyC9nk-u0mzEzIKdj4ARECvAbjc2zKVUuNQ', model: 'invalidModel' , context:"Responde en español" });
 
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch("Model \"invalidModel\" is not supported.");
  });