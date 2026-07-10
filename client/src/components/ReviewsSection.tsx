import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  verified: boolean
}

interface ReviewsSectionProps {
  productId: string
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
}

export default function ReviewsSection({
  productId,
  reviews = [],
  averageRating = 4.5,
  totalReviews = 128
}: ReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('helpful')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit review to API
    console.log('Submit review:', formData)
    setShowReviewForm(false)
    setFormData({ rating: 5, title: '', comment: '' })
  }

  const filteredReviews = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews

  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-8">التقييمات والمراجعات</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="card p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600">من {totalReviews} تقييم</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className="w-full text-right flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition"
              >
                <span className="text-sm font-semibold">{rating}⭐</span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-yellow-400 rounded"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-primary w-full mt-6"
          >
            {showReviewForm ? 'إلغاء' : 'اكتب تقييم'}
          </button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="card p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">اكتب تقييمك</h3>

              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="text-2xl"
                      >
                        {rating <= formData.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2">عنوان التقييم</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="مثال: منتج رائع جداً"
                    required
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold mb-2">التعليق</label>
                  <textarea
                    value={formData.comment}
                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full border rounded px-3 py-2 h-24"
                    placeholder="شارك رأيك عن المنتج..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">
                  نشر التقييم
                </button>
              </div>
            </form>
          )}

          {/* Sort Options */}
          <div className="mb-6">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="helpful">الأكثر فائدة</option>
              <option value="recent">الأحدث</option>
              <option value="highest">التقييم الأعلى</option>
              <option value="lowest">التقييم الأقل</option>
            </select>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {filteredReviews.slice(0, 5).map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{review.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                      <span>{review.author}</span>
                      {review.verified && (
                        <span className="badge bg-green-100 text-green-800 text-xs">
                          عملية مثبتة
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{review.date}</span>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                <button className="text-sm text-primary hover:underline">
                  👍 مفيد ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
