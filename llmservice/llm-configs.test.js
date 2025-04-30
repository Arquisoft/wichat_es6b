const llmConfigs = require('./llm-configs');

describe('LLM Configurations', () => {
  // Test URLs
  describe('URL generation', () => {
    it('should generate correct URL for Gemini', () => {
      const url = llmConfigs.gemini.url('test-api-key');
      expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=test-api-key');
    });

    it('should generate correct URL for empathy', () => {
      const url = llmConfigs.empathy.url();
      expect(url).toBe('https://empathyai.prod.empathy.co/v1/chat/completions');
    });
  });

  // Test transformRequest functions
  describe('Request transformations', () => {
    it('should transform request correctly for Gemini without context', () => {
      const result = llmConfigs.gemini.transformRequest('test question');
      expect(result).toEqual({
        contents: [
          {
            role: "user",
            parts: [{ text: 'test question' }]
          }
        ]
      });
    });

    it('should transform request correctly for Gemini with context', () => {
      const result = llmConfigs.gemini.transformRequest('test question', 'some context');
      expect(result).toEqual({
        contents: [
          {
            role: "user",
            parts: [{ text: 'some context\n\ntest question' }]
          }
        ]
      });
    });

    it('should transform request correctly for empathy without context', () => {
      const result = llmConfigs.empathy.transformRequest('test question');
      expect(result).toEqual({
        model: "qwen/Qwen2.5-Coder-7B-Instruct",
        stream: false,
        messages: [
          { role: "system", content: 'Deberas hablar en español' },
          { role: "user", content: 'test question' }
        ]
      });
    });

    it('should transform request correctly for empathy with context', () => {
      const result = llmConfigs.empathy.transformRequest('test question', 'custom context');
      expect(result).toEqual({
        model: "qwen/Qwen2.5-Coder-7B-Instruct",
        stream: false,
        messages: [
          { role: "system", content: 'custom context' },
          { role: "user", content: 'test question' }
        ]
      });
    });
  });

  // Test transformResponse functions
  describe('Response transformations', () => {
    it('should transform Gemini response correctly', () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [{ text: 'gemini answer' }]
              }
            }
          ]
        }
      };
      const result = llmConfigs.gemini.transformResponse(mockResponse);
      expect(result).toBe('gemini answer');
    });

    it('should handle missing fields in Gemini response', () => {
      const mockResponse = { data: { candidates: [] } };
      const result = llmConfigs.gemini.transformResponse(mockResponse);
      expect(result).toBeUndefined();
    });

    it('should transform empathy response correctly', () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'empathy answer'
              }
            }
          ]
        }
      };
      const result = llmConfigs.empathy.transformResponse(mockResponse);
      expect(result).toBe('empathy answer');
    });

    it('should handle missing fields in empathy response', () => {
      const mockResponse = { data: { choices: [] } };
      const result = llmConfigs.empathy.transformResponse(mockResponse);
      expect(result).toBeUndefined();
    });
  });

  // Test header functions
  describe('Header generation', () => {
    it('should generate correct headers for Gemini', () => {
      const headers = llmConfigs.gemini.headers();
      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    it('should generate correct headers for empathy', () => {
      const headers = llmConfigs.empathy.headers('test-api-key');
      expect(headers).toEqual({
        Authorization: 'Bearer test-api-key',
        'Content-Type': 'application/json'
      });
    });
  });
});