import express from 'express'
import { body } from 'express-validator'
import authController from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { validateEmail, validatePhone, validatePassword } from '../utils/validators.js'

const router = express.Router()

// Public routes
router.post('/register', [validateEmail(), validatePhone(), validatePassword()], authController.register)

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], authController.login)

router.post('/forgot-password', [validateEmail()], authController.forgotPassword)

router.post('/reset-password', [
  body('token').notEmpty(),
  validatePassword('newPassword'),
  body('confirmPassword').notEmpty()
], authController.resetPassword)

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser)

router.put('/profile', authenticate, authController.updateProfile)

router.put('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  validatePassword('newPassword'),
  body('confirmPassword').notEmpty()
], authController.changePassword)

export default router
