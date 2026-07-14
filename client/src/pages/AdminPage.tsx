import { useEffect, useState } from 'react'
import { productsAPI } from '../services/api'

interface Product {
  _id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  discountPrice?: number | null
  category: string
  image: string
  stock: number
}

const CATEGORIES = [
  { value: 'mens', label: 'عطور الرجال' },
  { value: 'womens', label: 'عطور النساء' },
  { value: 'unisex', label: 'للجنسين' },
  { value: 'bakhoor', label: 'البخور' },
  { value: 'oils', label: 'الزيوت' },
  { value: 'accessories', label: 'إكسسوارات' },
]

const emptyForm = {
  nameAr: '',
  descriptionAr: '',
  price: '',
  discountPrice: '',
  category: 'mens',
  image: '',
  stock: '',
}

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadProducts = () => {
    setLoading(true)
    productsAPI
      .getAll({ inStock: false, limit: 100 })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setError('تعذر تحميل المنتجات'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (tab === 'products') loadProducts()
  }, [tab])

  const openNewForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEditForm = (p: Product) => {
    setEditingId(p._id)
    setForm({
      nameAr: p.nameAr,
      descriptionAr: p.descriptionAr,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      category: p.category,
      image: p.image,
      stock: String(p.stock),
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.nameAr,
      nameAr: form.nameAr,
      description: form.descriptionAr,
      descriptionAr: form.descriptionAr,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      category: form.category,
      image: form.image,
      stock: Number(form.stock),
    }

    try {
      if (editingId) {
        await productsAPI.update(editingId, payload)
      } else {
        await productsAPI.create(payload)
      }
      setShowForm(false)
      loadProducts()
    } catch (err: any) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          'تعذر حفظ المنتج — تحقق من البيانات'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع.')) return
    try {
      await productsAPI.delete(id)
      loadProducts()
    } catch {
      setError('تعذر حذف المنتج')
    }
  }

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b">
          {(['dashboard', 'products', 'orders', 'users'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 font-semibold ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
            >
              {t === 'dashboard' ? 'لوحة البيانات' : t === 'products' ? 'المنتجات' : t === 'orders' ? 'الطلبات' : 'المستخدمون'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-4">ملخص الأداء</h2>
              <p className="text-gray-500">
                لوحة الإحصائيات (الإيرادات، الطلبات) تحتاج ربط نظام الطلبات — تواصل معي لإضافتها.
              </p>
            </div>
          )}

          {tab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">إدارة المنتجات ({products.length})</h2>
                <button className="btn-primary" onClick={openNewForm}>
                  + منتج جديد
                </button>
              </div>

              {error && <div className="text-red-600 mb-4">{error}</div>}

              {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4 bg-gray-50">
                  <h3 className="font-bold text-lg">{editingId ? 'تعديل المنتج' : 'منتج جديد'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">اسم المنتج</label>
                      <input
                        required
                        className="w-full border rounded px-3 py-2"
                        value={form.nameAr}
                        onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">الفئة</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">السعر (ر.س)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border rounded px-3 py-2"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">سعر بعد الخصم (اختياري)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border rounded px-3 py-2"
                        value={form.discountPrice}
                        onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">المخزون (الكمية)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        className="w-full border rounded px-3 py-2"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">رابط الصورة</label>
                      <input
                        required
                        type="url"
                        placeholder="https://..."
                        className="w-full border rounded px-3 py-2"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">الوصف</label>
                    <textarea
                      required
                      minLength={10}
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                      value={form.descriptionAr}
                      onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border rounded"
                      onClick={() => setShowForm(false)}
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <p className="text-gray-500">جاري التحميل...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-500">لا توجد منتجات بعد — أضف أول منتج.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-2">المنتج</th>
                        <th className="text-center py-2">الفئة</th>
                        <th className="text-center py-2">السعر</th>
                        <th className="text-center py-2">المخزون</th>
                        <th className="text-center py-2">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{p.nameAr}</td>
                          <td className="text-center">
                            {CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                          </td>
                          <td className="text-center">
                            {p.discountPrice ? (
                              <>
                                <span className="text-primary font-bold">{p.discountPrice}</span>{' '}
                                <span className="text-gray-400 line-through text-sm">{p.price}</span>
                              </>
                            ) : (
                              <span>{p.price}</span>
                            )}{' '}
                            ر.س
                          </td>
                          <td className={`text-center ${p.stock === 0 ? 'text-red-600 font-bold' : ''}`}>
                            {p.stock === 0 ? 'نفد المخزون' : p.stock}
                          </td>
                          <td className="text-center space-x-2 space-x-reverse">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => openEditForm(p)}
                            >
                              تعديل
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => handleDelete(p._id)}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">إدارة الطلبات</h2>
              <p className="text-gray-500">نظام الطلبات غير مفعّل بعد في هذا الإصدار.</p>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-4">إدارة العملاء</h2>
              <p className="text-gray-500">إدارة المستخدمين غير مفعّلة بعد في هذا الإصدار.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
