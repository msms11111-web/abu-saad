import { useState } from 'react'

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard')

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Stats Cards */}
        {[
          { label: 'الإيرادات', value: '125,000', currency: 'ر.س' },
          { label: 'الطلبات', value: '342', icon: '📦' },
          { label: 'العملاء', value: '1,245', icon: '👥' },
          { label: 'المنتجات', value: '156', icon: '🎁' },
        ].map((stat, i) => (
          <div key={i} className="card p-6">
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
            {stat.currency && <p className="text-gray-500 text-sm mt-2">{stat.currency}</p>}
          </div>
        ))}
      </div>

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
              <div className="bg-gray-100 h-64 rounded flex items-center justify-center text-gray-400">
                رسم بياني للإيرادات
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">إدارة المنتجات</h2>
                <button className="btn-primary">+ منتج جديد</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">المنتج</th>
                    <th className="text-center py-2">السعر</th>
                    <th className="text-center py-2">المخزون</th>
                    <th className="text-right py-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3">عطر أود برفيوم</td>
                      <td className="text-center">299 ر.س</td>
                      <td className="text-center">45</td>
                      <td className="text-right space-x-2">
                        <button className="text-blue-600 hover:underline">تعديل</button>
                        <button className="text-red-600 hover:underline">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold mb-4">إدارة الطلبات</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">رقم الطلب</th>
                    <th className="text-center py-2">العميل</th>
                    <th className="text-center py-2">المبلغ</th>
                    <th className="text-right py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3">ORD-2026-{i:03d}</td>
                      <td className="text-center">عميل</td>
                      <td className="text-center">450 ر.س</td>
                      <td className="text-right"><span className="badge bg-green-100 text-green-800">تم التسليم</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-4">إدارة العملاء</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">الاسم</th>
                    <th className="text-center py-2">البريد الإلكتروني</th>
                    <th className="text-center py-2">الطلبات</th>
                    <th className="text-right py-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3">عميل {i}</td>
                      <td className="text-center">user@example.com</td>
                      <td className="text-center">5</td>
                      <td className="text-right space-x-2">
                        <button className="text-blue-600 hover:underline">عرض</button>
                        <button className="text-red-600 hover:underline">حظر</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
