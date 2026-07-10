import { useState } from 'react'

export default function ProductPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
  })

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">المنتجات</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">التصفية</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">الفئة</label>
            <select
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">جميع الفئات</option>
              <option value="mens">عطور الرجال</option>
              <option value="womens">عطور النساء</option>
              <option value="unisex">جنسين</option>
              <option value="bakhoor">البخور</option>
              <option value="oils">الزيوت</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">السعر</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                className="w-full"
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              />
              <div className="text-sm text-gray-600">
                {filters.minPrice} ر.س - {filters.maxPrice} ر.س
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">التقييم</label>
            <select
              className="w-full border rounded px-3 py-2"
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
            <p className="text-gray-600">يتم تحميل المنتجات...</p>
            <select className="border rounded px-3 py-2">
              <option>الترتيب: الأحدث</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
              <option>التقييم الأعلى</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-400">صورة المنتج</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">عطر فاخر</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary text-lg font-bold">299 ر.س</span>
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  </div>
                  <button className="btn-primary w-full text-sm">
                    أضف للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
