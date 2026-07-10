import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export default function CheckoutPage() {
  const { total } = useSelector((state: RootState) => state.cart)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Process checkout
  }

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">الدفع</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="الاسم الكامل"
                className="w-full border rounded px-4 py-2"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full border rounded px-4 py-2"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="w-full border rounded px-4 py-2"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="العنوان"
                className="w-full border rounded px-4 py-2"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="المدينة"
                  className="border rounded px-4 py-2"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="الرمز البريدي"
                  className="border rounded px-4 py-2"
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  defaultChecked
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-2"
                />
                <span>بطاقة ائتمان</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-2"
                />
                <span>تحويل بنكي</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-2"
                />
                <span>الدفع عند الاستلام</span>
              </label>
            </div>
          </div>
        </form>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold">{total} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة (15%):</span>
              <span className="font-bold">{Math.round(total * 0.15)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن:</span>
              <span className="font-bold text-green-600">مجاني</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold text-primary text-lg">{total + Math.round(total * 0.15)} ر.س</span>
            </div>
          </div>
          <button type="submit" form="" className="btn-primary w-full">
            إتمام الشراء
          </button>
        </div>
      </div>
    </div>
  )
}
