const swaggerJsDoc = require('swagger-jsdoc');

/**
 * Swagger configuration options
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Staywise CRM API',
      version: '1.0.0',
      description: 'API documentation for Staywise Hotel CRM SaaS',
      contact: {
        name: 'Staywise Development Team'
      },
      servers: [
        {
          url: process.env.BASE_URL || 'http://localhost:5000',
          description: 'Development server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; 