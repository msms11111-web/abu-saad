import { Request, Response } from 'express'
import Product from '../models/Product.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import searchService from '../services/searchService.js'

export class ProductController {
  // Get all products
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, category, minPrice, maxPrice, rating, search, sortBy, inStock } = req.query

    const results = await searchService.searchProducts({
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : 0,
      maxPrice: maxPrice ? Number(maxPrice) : 10000,
      rating: rating ? Number(rating) : 0,
      search: search as string,
      page: Number(page),
      limit: Number(limit),
      sortBy: (sortBy as any) || 'newest',
      // Defaults to true (hide sold-out items on the storefront); pass
      // inStock=false so the admin panel can still see/manage them
      inStock: inStock === undefined ? true : inStock === 'true'
    })

    res.status(200).json({
      success: true,
      data: results.products,
      pagination: results.pagination
    })
  })

  // Get product by ID
  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const product = await Product.findById(id)
      .populate('reviews')
      .populate('vendor', 'name email')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      success: true,
      data: product
    })
  })

  // Create product
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { name, nameAr, description, descriptionAr, price, category, image, stock, fragrance, specifications } = req.body

    const product = new Product({
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      category,
      image,
      stock,
      fragrance,
      specifications,
      vendor: (req as any).user.id,
      sku: `SKU-${Date.now()}`
    })

    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  })

  // Update product
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  })

  // Delete product
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  })

  // Get featured products
  getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
    const featured = await searchService.getFeaturedProducts(10)

    res.status(200).json({
      success: true,
      data: featured
    })
  })

  // Get new products
  getNewProducts = asyncHandler(async (req: Request, res: Response) => {
    const newProducts = await searchService.getNewProducts(10)

    res.status(200).json({
      success: true,
      data: newProducts
    })
  })

  // Get popular products
  getPopularProducts = asyncHandler(async (req: Request, res: Response) => {
    const popular = await searchService.getPopularProducts(10)

    res.status(200).json({
      success: true,
      data: popular
    })
  })

  // Get related products
  getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const related = await searchService.getRelatedProducts(id, 5)

    res.status(200).json({
      success: true,
      data: related
    })
  })

  // Get by category
  getByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params
    const { page = 1, limit = 20 } = req.query

    const products = await Product.find({ category })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean()

    const total = await Product.countDocuments({ category })

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    })
  })

  // Search products
  searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query

    const results = await searchService.searchProducts({
      search: q as string,
      page: 1,
      limit: 20
    })

    res.status(200).json({
      success: true,
      data: results.products,
      pagination: results.pagination
    })
  })

  // Get statistics
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await searchService.getStatistics()

    res.status(200).json({
      success: true,
      data: stats
    })
  })
}

export default new ProductController()
