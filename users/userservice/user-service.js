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
        // Sanitize and validate username
        const sanitizedUsername = req.body.username ? 
            req.body.username.trim().replace(/[<>&"'`]/g, '') : '';

        // Use Mongoose's built-in methods instead of direct query construction
        const existingUser = await User.exists({
            username: { $eq: sanitizedUsername }
        }).exec();

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create user instance using Mongoose model
        const userInstance = new User();
        userInstance.username = sanitizedUsername;
        userInstance.password = hashedPassword;

        // Save using instance method
        await userInstance.save();
        
        res.json(userInstance);
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