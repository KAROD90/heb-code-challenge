const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'H-E-B Backend Code Exercise APIs',
    description: 'HTTP REST APIs for a service that ingests user images, analyzes them for object detection, and returns the enhanced content'
  },
  host: 'localhost:3000'
};

const outputFile = '../config/swagger-output.json';
const routes = ['../routes/images'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('../server')
});