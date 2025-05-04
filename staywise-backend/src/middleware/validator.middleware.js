const { validationResult, body, param, query } = require('express-validator');
const mongoose = require('mongoose');

// Validate ObjectId
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const userValidationRules = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password')
      .if(body('googleId').not().exists())
      .if(body('phoneAuth').not().exists())
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['admin', 'staff', 'superadmin'])
      .withMessage('Invalid role'),
    body('hotelRef')
      .if(body('role').not().equals('superadmin'))
      .custom(isValidObjectId)
      .withMessage('Valid hotel ID is required')
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().trim().isEmail().withMessage('Valid email is required'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['admin', 'staff', 'superadmin'])
      .withMessage('Invalid role')
  ],
  login: [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  forgotPassword: [
    body('email').trim().isEmail().withMessage('Valid email is required')
  ],
  resetPassword: [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]
};

// Hotel validation rules
const hotelValidationRules = {
  create: [
    body('name').trim().notEmpty().withMessage('Hotel name is required'),
    body('contactInfo.email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Hotel name cannot be empty'),
    body('contactInfo.email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
  ]
};

// Room validation rules
const roomValidationRules = {
  create: [
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('type')
      .isIn(['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential', 'Other'])
      .withMessage('Invalid room type'),
    body('price.base')
      .isNumeric()
      .withMessage('Base price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Base price must be a positive number'),
    body('hotelRef')
      .custom(isValidObjectId)
      .withMessage('Valid hotel ID is required')
  ],
  update: [
    body('roomNumber').optional().trim().notEmpty().withMessage('Room number cannot be empty'),
    body('type')
      .optional()
      .isIn(['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential', 'Other'])
      .withMessage('Invalid room type'),
    body('price.base')
      .optional()
      .isNumeric()
      .withMessage('Base price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Base price must be a positive number')
  ]
};

// Booking validation rules
const bookingValidationRules = {
  create: [
    body('guestName').trim().notEmpty().withMessage('Guest name is required'),
    body('guestPhone').trim().notEmpty().withMessage('Guest phone is required'),
    body('roomRef')
      .custom(isValidObjectId)
      .withMessage('Valid room ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('hotelRef')
      .custom(isValidObjectId)
      .withMessage('Valid hotel ID is required'),
    body('totalAmount')
      .isNumeric()
      .withMessage('Total amount must be a number')
      .isFloat({ min: 0 })
      .withMessage('Total amount must be a positive number'),
    body('checkInDate').custom((checkInDate, { req }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      
      return true;
    }),
    body('checkOutDate').custom((checkOutDate, { req }) => {
      const checkIn = new Date(req.body.checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }
      
      return true;
    })
  ],
  update: [
    body('guestName').optional().trim().notEmpty().withMessage('Guest name cannot be empty'),
    body('status')
      .optional()
      .isIn(['reserved', 'checked-in', 'checked-out', 'cancelled', 'no-show'])
      .withMessage('Invalid status'),
    body('checkInDate')
      .optional()
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .optional()
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('totalAmount')
      .optional()
      .isNumeric()
      .withMessage('Total amount must be a number')
      .isFloat({ min: 0 })
      .withMessage('Total amount must be a positive number')
  ]
};

// Order validation rules
const orderValidationRules = {
  create: [
    body('guestName').trim().notEmpty().withMessage('Guest name is required'),
    body('roomRef')
      .custom(isValidObjectId)
      .withMessage('Valid room ID is required'),
    body('hotelRef')
      .custom(isValidObjectId)
      .withMessage('Valid hotel ID is required'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.price')
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('totalAmount')
      .isNumeric()
      .withMessage('Total amount must be a number')
      .isFloat({ min: 0 })
      .withMessage('Total amount must be a positive number')
  ],
  update: [
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
      .withMessage('Invalid status')
  ]
};

// ID validation for route parameters
const idValidation = param('id')
  .custom(isValidObjectId)
  .withMessage('Invalid ID parameter');

module.exports = {
  validate,
  userValidationRules,
  hotelValidationRules,
  roomValidationRules,
  bookingValidationRules,
  orderValidationRules,
  idValidation
}; 