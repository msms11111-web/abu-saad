import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, 'uploads/')
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    cb(null, filename)
  }
})

// File filter
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'))
  }
  cb(null, true)
}

// Multer config
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
})

// Image processing utility
export const processImage = async (filePath: string) => {
  try {
    const sharp = require('sharp')
    const filename = path.basename(filePath)

    // Create thumbnail
    await sharp(filePath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(`uploads/thumbnails/${filename}`)

    return {
      original: `/uploads/${filename}`,
      thumbnail: `/uploads/thumbnails/${filename}`
    }
  } catch (error) {
    console.error('Image processing error:', error)
    throw new Error('Failed to process image')
  }
}

// Delete file utility
export const deleteFile = (filePath: string) => {
  try {
    const fs = require('fs')
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}
