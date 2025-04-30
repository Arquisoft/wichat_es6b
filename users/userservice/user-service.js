// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user-model')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(__dirname + '/userservice.yaml');
const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

class UserService {
  static async findUserByUsername(username) {
    // Sanitize username
    const sanitizedUsername = username ? username.trim().replace(/[<>&"'`]/g, '') : '';
    return await User.findOne({ username: sanitizedUsername });
  }

  static async createUser(username, password) {
    const sanitizedUsername = username ? username.trim().replace(/[<>&"'`]/g, '') : '';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username: sanitizedUsername,
      password: hashedPassword,
    });

    return await user.save();
  }
}

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        //const existingUser = await User.findOne({ username: req.body.username });

       // const validator = require('validator');
        //const username = validator.escape(req.body.username.trim());
        // Alternativa sin el paquete validator
        const existingUser = await UserService.findUserByUsername(req.body.username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = await UserService.createUser(req.body.username, req.body.password);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
}});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server