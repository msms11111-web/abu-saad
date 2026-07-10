import { useEffect, useState } from 'react'
import { productsAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

interface Product {
  _id: string
  name: string
  nameAr: string
  price: number
  discountPrice?: number
  image: string
  rating: number
  reviews: unknown[]
  isLatest?: boolean
}

export default function ProductPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
    sortBy: 'newest',
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    productsAPI
      .getAll({
        category: filters.category || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating || undefined,
        sortBy: filters.sortBy,
      })
      .then((res) => {
        if (!cancelled) setProducts(res.data.data || [])
      })
      .catch(() => {
        if (!cancelled) setError('تعذر تحميل المنتجات — حاول تحديث الصفحة')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters])

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">المنتجات</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="card p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">التصفية</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">الفئة</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">جميع الفئات</option>
              <option value="mens">عطور الرجال</option>
              <option value="womens">عطور النساء</option>
              <option value="unisex">للجنسين</option>
              <option value="bakhoor">البخور</option>
              <option value="oils">الزيوت</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">التقييم</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
            >
              <option value="0">جميع التقييمات</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 نجوم</option>
              <option value="4">⭐⭐⭐⭐ 4 نجوم فما فوق</option>
              <option value="3">⭐⭐⭐ 3 نجوم فما فوق</option>
            </select>
          </div>
        </div>

        {/* Main Content - Products Grid */}
        <div className="md:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'يتم تحميل المنتجات...' : `${products.length} منتج`}
            </p>
            <select
              className="border rounded px-3 py-2"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="newest">الترتيب: الأحدث</option>
              <option value="price">السعر: من الأقل للأعلى</option>
              <option value="rating">التقييم الأعلى</option>
              <option value="popular">الأكثر شهرة</option>
            </select>
          </div>

          {error && (
            <div className="card p-6 text-center text-red-600 mb-6">{error}</div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="card p-10 text-center text-gray-500">
              لا توجد منتجات مطابقة للتصفية الحالية
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-56" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-9 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : products.map((p) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    name={p.nameAr || p.name}
                    price={p.price}
                    discountPrice={p.discountPrice}
                    image={p.image}
                    rating={p.rating}
                    reviews={p.reviews?.length || 0}
                    isNew={p.isLatest}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
