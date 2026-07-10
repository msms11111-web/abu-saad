import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const { items } = useSelector((state: RootState) => state.cart)
  const { isAuthenticated } = useSelector((state: RootState) => state.user)

  return (
    <header className="bg-secondary text-white sticky top-0 z-50">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ✨ Saudi Essence
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-primary transition">
              الرئيسية
            </Link>
            <Link to="/products" className="hover:text-primary transition">
              المنتجات
            </Link>
            <a href="#about" className="hover:text-primary transition">
              عنا
            </a>
            <a href="#contact" className="hover:text-primary transition">
              اتصل بنا
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-primary transition">
              <ShoppingCartIcon className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="hover:text-primary transition">
                <UserIcon className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                دخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
