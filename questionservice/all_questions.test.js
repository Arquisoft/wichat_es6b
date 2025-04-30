const { queries } = require('./all_questions');
const server = require('./questions');

// Cerrar el servidor después de todas las pruebas
afterAll(done => {
  server.close(done);
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