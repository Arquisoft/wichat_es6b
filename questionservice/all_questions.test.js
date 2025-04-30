const { queries } = require('./all_questions');
const server = require('./questions');
const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

// Cerrar el servidor después de todas las pruebas
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
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

// Función auxiliar para hacer peticiones a la API
const makeQuestionRequest = async (thematic, language) => {
  return request(server)
    .get('/generateQuestion')
    .query({ thematic, language });
};

// Función auxiliar para validar la estructura de las consultas
const validateQueryStructure = (category) => {
  expect(Array.isArray(category)).toBe(true);
  category.forEach(query => {
    expect(Array.isArray(query)).toBe(true);
    expect(query.length).toBe(2);
    expect(typeof query[0]).toBe('string');
    expect(typeof query[1]).toBe('string');
  });
};

// Función auxiliar para validar consultas SPARQL
const validateSparqlQuery = (query) => {
  expect(query).toContain('SELECT');
  expect(query).toContain('WHERE');
  expect(
    query.includes('FILTER') || 
    query.includes('SERVICE wikibase:label') ||
    query.includes('OPTIONAL')
  ).toBe(true);
};

// Función auxiliar para validar textos de preguntas
const validateQuestionText = (questionText, language) => {
  const regex = language === 'es' ? /^[¿]?[A-Z].*\?$/ : /^[A-Z].*\?$/;
  expect(questionText).toMatch(regex);
};

describe('all_questions.js', () => {
  it('should have queries object with es and en languages', () => {
    expect(queries).toBeDefined();
    expect(queries).toHaveProperty('es');
    expect(queries).toHaveProperty('en');
  });

  // Función auxiliar para probar consultas en un idioma específico
  const testLanguageQueries = (language) => {
    const languageQueries = queries[language];
    const categories = ['Geografia', 'Cultura', 'Pintores', 'Futbolistas', 'Cantantes'];

    describe(`${language} queries`, () => {
      it('should have all required categories', () => {
        categories.forEach(category => {
          expect(languageQueries).toHaveProperty(category);
        });
      });

      it('should have correct structure for each category', () => {
        Object.values(languageQueries).forEach(validateQueryStructure);
      });

      it('should have valid SPARQL queries', () => {
        Object.values(languageQueries).forEach(category => {
          category.forEach(query => validateSparqlQuery(query[0]));
        });
      });

      it('should have valid question texts', () => {
        Object.values(languageQueries).forEach(category => {
          category.forEach(query => validateQuestionText(query[1], language));
        });
      });
    });
  };

  testLanguageQueries('es');
  testLanguageQueries('en');

  it('should have equivalent structure in both languages', () => {
    const spanishCategories = Object.keys(queries.es);
    const englishCategories = Object.keys(queries.en);
    expect(spanishCategories).toEqual(englishCategories);
  });
});

describe('All Questions Service', () => {
  // Función auxiliar para probar preguntas de una categoría
  const testCategoryQuestions = (category, spanishQuestion, englishQuestion) => {
    describe(`${category} queries`, () => {
      it(`should generate a ${category.toLowerCase()} question in Spanish`, async () => {
        const response = await makeQuestionRequest(category, 'es');
        expect(response.statusCode).toBe(200);
        expect(response.body.responseQuestion).toBe(spanishQuestion);
        expect(response.body.responseOptions.length).toBe(4);
        expect(response.body.responseImage).toBeDefined();
      });

      it(`should generate a ${category.toLowerCase()} question in English`, async () => {
        const response = await makeQuestionRequest(category, 'en');
        expect(response.statusCode).toBe(200);
        expect(response.body.responseQuestion).toBe(englishQuestion);
        expect(response.body.responseOptions.length).toBe(4);
        expect(response.body.responseImage).toBeDefined();
      });
    });
  };

  testCategoryQuestions('Geografia', 
    '¿Que país es el que aparece en la siguiente imagen?',
    'What country is the one that appears in the following image?'
  );

  testCategoryQuestions('Cultura',
    '¿Que monumento español es este?',
    'What Spanish monument is this?'
  );

  testCategoryQuestions('Pintores',
    '¿Cuál es el nombre de este pintor?',
    'What is the name of this painter?'
  );

  testCategoryQuestions('Cantantes',
    '¿Cuál es el nombre de este cantante?',
    'What is the name of this singer?'
  );

  describe('Error handling', () => {
    it('should handle Wikidata API errors', async () => {
      axios.get.mockImplementationOnce(() => {
        throw new Error('Wikidata API error');
      });

      const response = await makeQuestionRequest('Geografia', 'es');
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid thematic', async () => {
      const response = await makeQuestionRequest('InvalidThematic', 'es');
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid language', async () => {
      const response = await makeQuestionRequest('Geografia', 'invalid');
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 