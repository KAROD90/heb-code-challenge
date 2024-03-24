require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('./config/dbConnection');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./config/swagger-output.json')

//Init Express App/Set Server Port
const server = express();
const port = process.env.SERVER_PORT || 3500;

//Init DB/Sync and start server upon success
initializeDatabase()
  .then(() => {
    server.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch(error => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });

//Middleware to handle JSON/URL encoded request
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
//Middleware Swagger API Documentation
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Routes
server.use('/', require('./routes/images'));