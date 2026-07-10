import { useState } from 'react'

export default function ProfilePage() {
  const [tab, setTab] = useState<'info' | 'orders' | 'wishlist' | 'settings'>('info')

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">حسابي</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="card p-4">
          <div className="space-y-2">
            <button
              onClick={() => setTab('info')}
              className={`w-full text-right px-4 py-2 rounded ${tab === 'info' ? 'bg-primary text-secondary' : 'hover:bg-gray-100'}`}
            >
              المعلومات الشخصية
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`w-full text-right px-4 py-2 rounded ${tab === 'orders' ? 'bg-primary text-secondary' : 'hover:bg-gray-100'}`}
            >
              طلباتي
            </button>
            <button
              onClick={() => setTab('wishlist')}
              className={`w-full text-right px-4 py-2 rounded ${tab === 'wishlist' ? 'bg-primary text-secondary' : 'hover:bg-gray-100'}`}
            >
              قائمة الرغبات
            </button>
            <button
              onClick={() => setTab('settings')}
              className={`w-full text-right px-4 py-2 rounded ${tab === 'settings' ? 'bg-primary text-secondary' : 'hover:bg-gray-100'}`}
            >
              الإعدادات
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {tab === 'info' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">المعلومات الشخصية</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">الاسم</label>
                  <input type="text" defaultValue="محمد أحمد" className="w-full border rounded px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <input type="email" defaultValue="user@example.com" className="w-full border rounded px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                  <input type="tel" defaultValue="+966501234567" className="w-full border rounded px-4 py-2" />
                </div>
                <button className="btn-primary">حفظ التغييرات</button>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">طلباتي</h2>
              <div className="space-y-4">
                <div className="border rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">ORD-2026-001</span>
                    <span className="badge bg-green-100 text-green-800">تم التسليم</span>
                  </div>
                  <p className="text-sm text-gray-600">2026-07-13 • 448 ر.س</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">قائمة الرغبات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded overflow-hidden">
                    <div className="bg-gray-200 h-40"></div>
                    <div className="p-4">
                      <h3 className="font-bold">عطر فاخر</h3>
                      <p className="text-primary font-bold">299 ر.س</p>
                      <button className="btn-primary w-full mt-2 text-sm">أضف للسلة</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span>الإشعارات البريدية</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span>الرسائل التسويقية</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span>اللغة</span>
                  <select className="border rounded px-3 py-1">
                    <option>العربية</option>
                    <option>English</option>
                  </select>
                </div>
                <button className="btn-secondary w-full mt-6">تغيير كلمة المرور</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
