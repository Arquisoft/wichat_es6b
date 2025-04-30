const axios = require('axios');
const express = require('express');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());

// Define configurations for different LLM APIs
const llmConfigs = {
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      transformRequest: (question, context = '') => ({
        contents: [
          {
            role: "user",
            parts: [{ text: context ? `${context}\n\n${question}` : question }]
          }
        ]
      }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text,
    headers: () => ({
      'Content-Type': 'application/json'
    })
  },
  empathy: {
    url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
    transformRequest: (question, context =  'Deberas hablar en gallego' ) => ({
      model: "qwen/Qwen2.5-Coder-7B-Instruct",
      stream: false,
      messages: [
        { role: "system", content: context },
        { role: "user", content: question }
      ]
    }),
    transformResponse: (response) => response.data.choices[0]?.message?.content,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }
};

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  if (!req.body) {
    throw new Error("Invalid JSON body");
  }
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}


// Generic function to send questions to LLM
async function sendQuestionToLLM(question, apiKey, model = 'gemini', context = '') {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Model "${model}" is not supported.`);
    }

    const url = config.url(apiKey);
    const requestData = config.transformRequest(question, context);

    const headers= config.headers ? config.headers(apiKey) : { 'Content-Type': 'application/json' };
    
	console.log(url); 
    const response = await axios.post(url, requestData, { headers });

    return config.transformResponse(response);

  } catch (error) {
    console.error(`Error sending question to ${model}:`, error.message || error);
    throw error;
  }
}

app.post('/ask', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['question', 'model', 'apiKey']);
    

    console.log('Body recibido:', req.body); // ← Añade esto

    const { question, model, apiKey, context } = req.body;
    const answer = await sendQuestionToLLM(question, apiKey, model,context);
    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`LLM Service listening at http://localhost:${port}`);
});

module.exports = server
