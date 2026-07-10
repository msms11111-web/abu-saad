import { body, param, query, ValidationChain } from 'express-validator'

// Email validation
export const validateEmail = (fieldName = 'email'): ValidationChain => {
  return body(fieldName)
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format')
}

// Phone validation (Saudi format)
export const validatePhone = (fieldName = 'phone'): ValidationChain => {
  return body(fieldName)
    .matches(/^\+?966[0-9]{9}$/)
    .withMessage('Invalid Saudi phone number')
}

// Password validation
export const validatePassword = (fieldName = 'password'): ValidationChain => {
  return body(fieldName)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain number')
}

// Product name validation
export const validateProductName = (): ValidationChain => {
  return body('name')
    .isLength({ min: 3, max: 200 })
    .trim()
    .withMessage('Product name must be between 3-200 characters')
}

// Price validation
export const validatePrice = (fieldName = 'price'): ValidationChain => {
  return body(fieldName)
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
}

// Rating validation
export const validateRating = (fieldName = 'rating'): ValidationChain => {
  return body(fieldName)
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1-5')
}

// Pagination validation
export const validatePagination = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100')
  ]
}

// Object ID validation
export const validateObjectId = (fieldName = 'id'): ValidationChain => {
  return param(fieldName)
    .isMongoId()
    .withMessage('Invalid ID format')
}
