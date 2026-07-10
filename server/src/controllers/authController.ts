import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import emailService from '../services/emailService.js'

export class AuthController {
  // Register
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, password, passwordConfirm } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Check password match
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      })
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password
    })

    await user.save()

    // Send welcome email
    await emailService.sendWelcomeEmail(email, name)

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  })

  // Login
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  })

  // Get current user
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  })

  // Update profile
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id
    const { name, phone, address, preferences } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, preferences },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  })

  // Change password
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id
    const { currentPassword, newPassword, confirmPassword } = req.body

    const user = await User.findById(userId).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const isValid = await user.comparePassword(currentPassword)

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  })

  // Forgot password
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    })

    await emailService.sendPasswordReset(email, resetToken)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    })
  })

  // Reset password
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      })
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      user.password = newPassword
      await user.save()

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }
  })
}

export default new AuthController()
