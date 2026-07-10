import Product from '../models/Product.js'

interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  inStock?: boolean
  page?: number
  limit?: number
  sortBy?: 'price' | 'rating' | 'newest' | 'popular'
}

export class SearchService {
  async searchProducts(filters: FilterOptions) {
    try {
      const {
        category,
        minPrice = 0,
        maxPrice = 10000,
        rating = 0,
        search,
        inStock = true,
        page = 1,
        limit = 20,
        sortBy = 'newest'
      } = filters

      // Build query
      const query: any = {}

      // Category filter
      if (category) {
        query.category = category
      }

      // Price filter
      if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = minPrice
        if (maxPrice) query.price.$lte = maxPrice
      }

      // Rating filter
      if (rating > 0) {
        query.rating = { $gte: rating }
      }

      // Stock filter
      if (inStock) {
        query.stock = { $gt: 0 }
      }

      // Text search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { nameAr: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { descriptionAr: { $regex: search, $options: 'i' } }
        ]
      }

      // Sorting
      let sortQuery: any = {}
      switch (sortBy) {
        case 'price':
          sortQuery = { price: 1 }
          break
        case 'rating':
          sortQuery = { rating: -1 }
          break
        case 'popular':
          sortQuery = { reviews: -1 }
          break
        case 'newest':
        default:
          sortQuery = { createdAt: -1 }
      }

      // Pagination
      const skip = (page - 1) * limit

      // Execute query
      const products = await Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate('reviews')
        .lean()

      // Get total count
      const total = await Product.countDocuments(query)

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      throw new Error(`Search error: ${error}`)
    }
  }

  async getRelatedProducts(productId: string, limit: number = 5) {
    try {
      const product = await Product.findById(productId).lean()

      if (!product) {
        throw new Error('Product not found')
      }

      const related = await Product.find({
        _id: { $ne: productId },
        category: product.category,
        vendor: product.vendor
      })
        .limit(limit)
        .lean()

      return related
    } catch (error) {
      throw new Error(`Related products error: ${error}`)
    }
  }

  async getPopularProducts(limit: number = 10) {
    try {
      return await Product.find()
        .sort({ rating: -1, reviews: -1 })
        .limit(limit)
        .lean()
    } catch (error) {
      throw new Error(`Popular products error: ${error}`)
    }
  }

  async getNewProducts(limit: number = 10) {
    try {
      return await Product.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
    } catch (error) {
      throw new Error(`New products error: ${error}`)
    }
  }

  async getFeaturedProducts(limit: number = 10) {
    try {
      return await Product.find({ isFeature: true })
        .limit(limit)
        .lean()
    } catch (error) {
      throw new Error(`Featured products error: ${error}`)
    }
  }

  async getProductsByCategory(category: string, limit: number = 20) {
    try {
      return await Product.find({ category })
        .limit(limit)
        .lean()
    } catch (error) {
      throw new Error(`Category products error: ${error}`)
    }
  }

  async getStatistics() {
    try {
      const stats = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            avgRating: { $avg: '$rating' }
          }
        }
      ])

      return stats
    } catch (error) {
      throw new Error(`Statistics error: ${error}`)
    }
  }
}

export default new SearchService()
