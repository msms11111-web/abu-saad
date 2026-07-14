import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import store, { RootState } from './store'
import { setUser } from './store/slices/userSlice'
import { usersAPI } from './services/api'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import { AboutPage, TermsPage, ReturnsPage, PrivacyPage, ContactPage } from './pages/LegalPages'
import 'react-toastify/dist/ReactToastify.css'

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: any) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

// Restores the logged-in session from the saved token on page load/refresh —
// without this, Redux state resets on every reload and the user appears
// logged out even though their token is still valid.
function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setChecked(true)
      return
    }
    usersAPI
      .getCurrentUser()
      .then((res) => {
        if (res.data.success) dispatch(setUser(res.data.data))
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChecked(true))
  }, [dispatch])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        جاري التحميل...
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  return (
    <Provider store={store}>
      <SessionBootstrap>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
      />
      </SessionBootstrap>
    </Provider>
  )
}

export default App
