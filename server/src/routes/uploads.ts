import express, { Request, Response } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import Image from '../models/Image.js'

const router = express.Router()

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// memoryStorage (not disk): Render's free web service filesystem doesn't
// survive restarts, so the file never touches disk — it goes straight to
// Sharp for compression, then into MongoDB via the Image model.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('يُسمح فقط بصور JPEG أو PNG أو WebP'))
    }
    cb(null, true)
  }
})

router.post(
  '/',
  authenticate,
  authorize('admin', 'vendor'),
  upload.single('image'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم إرفاق أي صورة' })
    }

    // Cap dimensions and re-encode as JPEG to keep documents small in Atlas
    const compressed = await sharp(req.file.buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const image = await Image.create({ data: compressed, contentType: 'image/jpeg' })

    res.status(201).json({
      success: true,
      url: `/api/uploads/${image._id}`
    })
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const image = await Image.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }
    res.set('Content-Type', image.contentType)
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(image.data)
  })
)

export default router
