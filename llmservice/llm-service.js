const axios = require('axios');
const express = require('express');
const llmConfigs = require('./llm-configs');
const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());

// Define configurations for different LLM APIs


// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
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
    
    const response = await axios.post(url, requestData, { headers });

    return config.transformResponse(response);

  } catch (error) {
    throw error;
  }
}

app.post('/ask', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['question', 'model', 'apiKey']);
  

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
