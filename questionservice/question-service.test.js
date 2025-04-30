const axios = require('axios');
const request = require('supertest');
const server = require('./questions'); // Importa el servidor desde questions.js
const { expect } = require('@jest/globals');

jest.mock('axios'); // Mockear Axios para controlar las respuestas en las pruebas

afterAll(() => {
  server.close(); // Cierra el servidor al final de las pruebas
});

describe('Generación de preguntas sobre futbolistas', () => {
  // Mock para axios
  axios.get.mockImplementation((url) => {
    if (url === 'https://query.wikidata.org/sparql') {
      // Respuesta mock que contiene 4 futbolistas con sus imágenes
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

  it('should generate a question with 4 options, an image, and a correct answer', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'es' });

    // Verificar que el servidor responde correctamente
    expect(response.statusCode).toBe(200);

    // Verificar que la pregunta generada sea "¿Cuál es el nombre de este futbolista?"
    expect(response.body.responseQuestion).toBe('¿Cuál es el nombre de este futbolista?'); 

    // Verificar que se generó una pregunta
    expect(response.body.responseQuestion).toBeDefined();
    expect(typeof response.body.responseQuestion).toBe('string'); // La pregunta es texto

    // Verificar que la imagen existe y tiene un formato válido
    expect(response.body.responseImage).toBeDefined();
    expect(response.body.responseImage).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png)$/); // URL válida

    // Verificar que hay exactamente 4 opciones
    expect(response.body.responseOptions).toBeDefined();
    expect(response.body.responseOptions.length).toBe(4); // Deben ser exactamente 4 opciones

    // Verificar que todas las opciones son texto
    response.body.responseOptions.forEach(option => {
      expect(typeof option).toBe('string'); // Cada opción es texto
    });

    // Verificar que hay una respuesta correcta
    expect(response.body.responseCorrectOption).toBeDefined();
    expect(response.body.responseOptions).toContain(response.body.responseCorrectOption); // La respuesta correcta está entre las opciones

    // Verificar que solo 1 opción sea la correcta
    const correctOccurrences = response.body.responseOptions.filter(
      option => option === response.body.responseCorrectOption
    ).length;
    expect(correctOccurrences).toBe(1); // Debe haber exactamente 1 respuesta correcta
  });

  it('should generate a question with 4 options, an image, and a correct answer', async () => {
    const response = await request(server)
      .get('/generateQuestion')
      .query({ thematic: 'Futbolistas', language: 'en' });

    // Verificar que el servidor responde correctamente
    expect(response.statusCode).toBe(200);

    // Verificar que la pregunta generada sea "What is the name of this footballer?"
    expect(response.body.responseQuestion).toBe('What is the name of this footballer?'); // Verificación específica de la pregunta

    // Verificar que se generó una pregunta
    expect(response.body.responseQuestion).toBeDefined();
    expect(typeof response.body.responseQuestion).toBe('string'); // La pregunta es texto

    // Verificar que la imagen existe y tiene un formato válido
    expect(response.body.responseImage).toBeDefined();
    expect(response.body.responseImage).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png)$/); // URL válida

    // Verificar que hay exactamente 4 opciones
    expect(response.body.responseOptions).toBeDefined();
    expect(response.body.responseOptions.length).toBe(4); // Deben ser exactamente 4 opciones

    // Verificar que todas las opciones son texto
    response.body.responseOptions.forEach(option => {
      expect(typeof option).toBe('string'); // Cada opción es texto
    });

    // Verificar que hay una respuesta correcta
    expect(response.body.responseCorrectOption).toBeDefined();
    expect(response.body.responseOptions).toContain(response.body.responseCorrectOption); // La respuesta correcta está entre las opciones

    // Verificar que solo 1 opción sea la correcta
    const correctOccurrences = response.body.responseOptions.filter(
      option => option === response.body.responseCorrectOption
    ).length;
    expect(correctOccurrences).toBe(1); // Debe haber exactamente 1 respuesta correcta
  });
});
