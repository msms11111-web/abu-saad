import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import productController from '../controllers/productController.js'
import { validateProductName, validatePrice, validateObjectId } from '../utils/validators.js'

const router = express.Router()

// Public routes
router.get('/', productController.getAllProducts)
router.get('/featured', productController.getFeaturedProducts)
router.get('/new', productController.getNewProducts)
router.get('/popular', productController.getPopularProducts)
router.get('/category/:category', productController.getByCategory)
router.get('/search', productController.searchProducts)
router.get('/stats', productController.getStatistics)
router.get('/:id/related', validateObjectId('id'), productController.getRelatedProducts)
router.get('/:id', validateObjectId('id'), productController.getProductById)

// Protected routes (Admin/Vendor only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'vendor'),
  [validateProductName(), validatePrice()],
  productController.createProduct
)

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'vendor'),
  validateObjectId('id'),
  productController.updateProduct
)

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateObjectId('id'),
  productController.deleteProduct
)

export default router
