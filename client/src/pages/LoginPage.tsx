import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/userSlice'
import { usersAPI } from '../services/api'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = isLogin
        ? await usersAPI.login({ email: formData.email, password: formData.password })
        : await usersAPI.register(formData)

      const data = response.data

      if (data.success) {
        localStorage.setItem('token', data.token)
        dispatch(setUser(data.user))
        navigate('/')
      } else {
        alert(data.message)
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'حدث خطأ في المحاولة — تأكد من البيانات وحاول مجدداً'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full card p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Saudi Essence</h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded px-4 py-2"
                  placeholder="+966501234567"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                className="w-full border rounded px-4 py-2"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'جاري التحميل...' : isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ name: '', email: '', phone: '', password: '', passwordConfirm: '' })
              }}
              className="text-primary font-bold hover:underline mr-2"
            >
              {isLogin ? 'إنشاء حساب' : 'دخول'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              هل نسيت كلمة المرور؟
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
