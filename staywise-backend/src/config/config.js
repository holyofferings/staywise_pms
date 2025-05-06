const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-billing',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_key',
  NODE_ENV: process.env.NODE_ENV || 'development',
}; 