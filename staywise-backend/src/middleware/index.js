const authMiddleware = require('./auth.middleware');
const uploadMiddleware = require('./upload.middleware');
const validatorMiddleware = require('./validator.middleware');
const errorMiddleware = require('./error.middleware');

module.exports = {
  ...authMiddleware,
  ...uploadMiddleware,
  ...validatorMiddleware,
  ...errorMiddleware
}; 