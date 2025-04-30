const { queries } = require('./all_questions');
const server = require('./questions');
const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

// Cerrar el servidor después de todas las pruebas
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Aumentamos el tiempo de espera
  await server.close();
});

// Limpiar los mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  // Mock por defecto para todas las llamadas a axios.get
  axios.get.mockImplementation((url) => {
    if (url === 'https://query.wikidata.org/sparql') {
      return Promise.resolve({
        data: {
          results: {
            bindings: [
              { optionLabel: { value: 'España' }, imageLabel: { value: 'https://example.com/spain.jpg' } },
              { optionLabel: { value: 'Francia' }, imageLabel: { value: 'https://example.com/france.jpg' } },
              { optionLabel: { value: 'Italia' }, imageLabel: { value: 'https://example.com/italy.jpg' } },
              { optionLabel: { value: 'Alemania' }, imageLabel: { value: 'https://example.com/germany.jpg' } },
            ],
          },
        },
      });
    }
    return Promise.reject(new Error('URL no válida'));
  });
});

describe('all_questions.js', () => {
  // Verificar que queries existe y tiene la estructura correcta
  it('should have queries object with es and en languages', () => {
    expect(queries).toBeDefined();
    expect(queries).toHaveProperty('es');
    expect(queries).toHaveProperty('en');
  });

  // Verificar la estructura de las consultas en español
  describe('Spanish queries', () => {
    const spanishQueries = queries.es;

    it('should have all required categories', () => {
      expect(spanishQueries).toHaveProperty('Geografia');
      expect(spanishQueries).toHaveProperty('Cultura');
      expect(spanishQueries).toHaveProperty('Pintores');
      expect(spanishQueries).toHaveProperty('Futbolistas');
      expect(spanishQueries).toHaveProperty('Cantantes');
    });

    it('should have correct structure for each category', () => {
      Object.values(spanishQueries).forEach(category => {
        expect(Array.isArray(category)).toBe(true);
        category.forEach(query => {
          expect(Array.isArray(query)).toBe(true);
          expect(query.length).toBe(2);
          expect(typeof query[0]).toBe('string'); // SPARQL query
          expect(typeof query[1]).toBe('string'); // Question text
        });
      });
    });

    it('should have valid SPARQL queries', () => {
      Object.values(spanishQueries).forEach(category => {
        category.forEach(query => {
          const sparqlQuery = query[0];
          expect(sparqlQuery).toContain('SELECT');
          expect(sparqlQuery).toContain('WHERE');
          expect(
            sparqlQuery.includes('FILTER') || 
            sparqlQuery.includes('SERVICE wikibase:label') ||
            sparqlQuery.includes('OPTIONAL')
          ).toBe(true);
        });
      });
    });

    it('should have valid question texts', () => {
      Object.values(spanishQueries).forEach(category => {
        category.forEach(query => {
          const questionText = query[1];
          expect(questionText).toMatch(/^[¿]?[A-Z].*\?$/); // Debe empezar con mayúscula y terminar con ?
        });
      });
    });
  });

  // Verificar la estructura de las consultas en inglés
  describe('English queries', () => {
    const englishQueries = queries.en;

    it('should have all required categories', () => {
      expect(englishQueries).toHaveProperty('Geografia');
      expect(englishQueries).toHaveProperty('Cultura');
      expect(englishQueries).toHaveProperty('Pintores');
      expect(englishQueries).toHaveProperty('Futbolistas');
      expect(englishQueries).toHaveProperty('Cantantes');
    });

    it('should have correct structure for each category', () => {
      Object.values(englishQueries).forEach(category => {
        expect(Array.isArray(category)).toBe(true);
        category.forEach(query => {
          expect(Array.isArray(query)).toBe(true);
          expect(query.length).toBe(2);
          expect(typeof query[0]).toBe('string'); // SPARQL query
          expect(typeof query[1]).toBe('string'); // Question text
        });
      });
    });

    it('should have valid SPARQL queries', () => {
      Object.values(englishQueries).forEach(category => {
        category.forEach(query => {
          const sparqlQuery = query[0];
          expect(sparqlQuery).toContain('SELECT');
          expect(sparqlQuery).toContain('WHERE');
          expect(
            sparqlQuery.includes('FILTER') || 
            sparqlQuery.includes('SERVICE wikibase:label') ||
            sparqlQuery.includes('OPTIONAL')
          ).toBe(true);
        });
      });
    });

    it('should have valid question texts', () => {
      Object.values(englishQueries).forEach(category => {
        category.forEach(query => {
          const questionText = query[1];
          expect(questionText).toMatch(/^[A-Z].*\?$/); // Debe empezar con mayúscula y terminar con ?
        });
      });
    });
  });

  // Verificar que las consultas en español e inglés son equivalentes
  it('should have equivalent structure in both languages', () => {
    const spanishCategories = Object.keys(queries.es);
    const englishCategories = Object.keys(queries.en);

    expect(spanishCategories).toEqual(englishCategories);
    expect(spanishCategories.length).toBe(englishCategories.length);
  });

  // Verificar que las consultas SPARQL son válidas para cada categoría
  describe('SPARQL query validation', () => {
    const validateSparqlQuery = (query) => {
      expect(query).toContain('SELECT');
      expect(query).toContain('WHERE');
      expect(
        query.includes('FILTER') || 
        query.includes('SERVICE wikibase:label') ||
        query.includes('OPTIONAL')
      ).toBe(true);
    };

    it('should have valid SPARQL queries for Geografia', () => {
      const spanishQuery = queries.es.Geografia[0][0];
      const englishQuery = queries.en.Geografia[0][0];
      validateSparqlQuery(spanishQuery);
      validateSparqlQuery(englishQuery);
    });

    it('should have valid SPARQL queries for Cultura', () => {
      const spanishQuery = queries.es.Cultura[0][0];
      const englishQuery = queries.en.Cultura[0][0];
      validateSparqlQuery(spanishQuery);
      validateSparqlQuery(englishQuery);
    });

    it('should have valid SPARQL queries for Pintores', () => {
      const spanishQuery = queries.es.Pintores[0][0];
      const englishQuery = queries.en.Pintores[0][0];
      validateSparqlQuery(spanishQuery);
      validateSparqlQuery(englishQuery);
    });

    it('should have valid SPARQL queries for Futbolistas', () => {
      const spanishQuery = queries.es.Futbolistas[0][0];
      const englishQuery = queries.en.Futbolistas[0][0];
      validateSparqlQuery(spanishQuery);
      validateSparqlQuery(englishQuery);
    });

    it('should have valid SPARQL queries for Cantantes', () => {
      const spanishQuery = queries.es.Cantantes[0][0];
      const englishQuery = queries.en.Cantantes[0][0];
      validateSparqlQuery(spanishQuery);
      validateSparqlQuery(englishQuery);
    });
  });
});

describe('All Questions Service', () => {
  describe('Geografia queries', () => {
    it('should generate a geography question in Spanish', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Geografia', language: 'es' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('¿Que país es el que aparece en la siguiente imagen?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });

    it('should generate a geography question in English', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Geografia', language: 'en' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('What country is the one that appears in the following image?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });
  });

  describe('Cultura queries', () => {
    it('should generate a culture question in Spanish', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Cultura', language: 'es' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('¿Que monumento español es este?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });

    it('should generate a culture question in English', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Cultura', language: 'en' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('What Spanish monument is this?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });
  });

  describe('Pintores queries', () => {
    it('should generate a painter question in Spanish', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Pintores', language: 'es' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('¿Cuál es el nombre de este pintor?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });

    it('should generate a painter question in English', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Pintores', language: 'en' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('What is the name of this painter?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });
  });

  describe('Cantantes queries', () => {
    it('should generate a singer question in Spanish', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Cantantes', language: 'es' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('¿Cuál es el nombre de este cantante?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });

    it('should generate a singer question in English', async () => {
      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Cantantes', language: 'en' });

      expect(response.statusCode).toBe(200);
      expect(response.body.responseQuestion).toBe('What is the name of this singer?');
      expect(response.body.responseOptions.length).toBe(4);
      expect(response.body.responseImage).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle Wikidata API errors', async () => {
      axios.get.mockImplementationOnce(() => {
        throw new Error('Wikidata API error');
      });

      const response = await request(server)
        .get('/generateQuestion')
        .query({ thematic: 'Geografia', language: 'es' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
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
        .query({ thematic: 'Geografia', language: 'invalid' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 