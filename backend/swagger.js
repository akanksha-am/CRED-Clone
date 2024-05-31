const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();
 
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my project',
    },
    servers: [
      {
        url: 'http://34.193.75.54/:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
 
const specs = swaggerJsdoc(options);
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
 
module.exports = app;
 