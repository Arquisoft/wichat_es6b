const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const app = express();
const port = 8000;

const serviceUrls = {
  llm: process.env.LLM_SERVICE_URL || 'http://localhost:8003',
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8002',
  user: process.env.USER_SERVICE_URL || 'http://localhost:8001',
  questions: process.env.QUESTION_SERVICE_URL || 'http://localhost:8010',
  history: process.env.HISTORY_SERVICE_URL || 'http://localhost:8004',
};

app.use(cors());
app.use(express.json());

// Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const forwardRequest = async (url, req, res) => {
  try {
    const response = await axios.post(url, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
};

app.post('/login', (req, res) => forwardRequest(serviceUrls.auth + '/login', req, res));
app.post('/adduser', (req, res) => forwardRequest(serviceUrls.user + '/adduser', req, res));
app.post('/askllm', (req, res) => forwardRequest(serviceUrls.llm + '/ask', req, res));
app.post('/savegame', async (req, res) => {
  try {
    const response = await axios.post(serviceUrls.history + '/savegame', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

app.get('/stats/:username', async (req, res) => {
  try {
    const response = await axios.get(serviceUrls.history + `/stats/${req.params.username}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

app.get('/rankings', async (req, res) => {
  try {
    const response = await axios.get(serviceUrls.history + `/rankings`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

app.get('/history/:username', async (req, res) => {
  try {
    const response = await axios.get(serviceUrls.history + `/history/${req.params.username}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

app.get('/generateQuestions', async (req, res) => {
  try {
    const response = await axios.get(`${serviceUrls.questions}/generateQuestion`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    console.error('Error occurred in generateQuestion:', error);
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || 'Internal Server Error' });
  }
});

// OpenAPI Swagger configuration
const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = YAML.parse(file);
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.");
}

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;g