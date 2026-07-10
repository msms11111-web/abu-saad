import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { addToCart } from '../store/slices/cartSlice'
import { RootState } from '../store'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  discountPrice?: number
  image: string
  rating: number
  reviews: number
  isNew?: boolean
  isDiscount?: boolean
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  image,
  rating,
  reviews,
  isNew = false,
  isDiscount = false
}: ProductCardProps) {
  const dispatch = useDispatch()
  const [isFavorited, setIsFavorited] = useState(false)

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id,
        name,
        price: discountPrice || price,
        quantity: 1,
        image
      })
    )
  }

  const discountPercentage =
    discountPrice && price ? Math.round(((price - discountPrice) / price) * 100) : 0

  return (
    <div className="card overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-105">
      {/* Image Container */}
      <div className="relative h-56 bg-gray-200 overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="badge bg-blue-500 text-white text-xs font-bold">جديد</span>
          )}
          {discountPercentage > 0 && (
            <span className="badge bg-red-500 text-white text-xs font-bold">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="bg-primary text-secondary px-6 py-2 rounded-lg font-bold hover:bg-accent transition flex items-center gap-2"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            أضف للسلة
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          {isFavorited ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link to={`/products/${id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-primary transition line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {'⭐'.repeat(Math.floor(rating))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {discountPrice ? (
            <>
              <span className="text-lg font-bold text-primary">{discountPrice} ر.س</span>
              <span className="text-sm text-gray-400 line-through">{price} ر.س</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">{price} ر.س</span>
          )}
        </div>

        {/* Add to Cart Button (Mobile) */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary text-sm hidden sm:block"
        >
          أضف للسلة
        </button>
      </div>
    </div>
  )
}
