import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store'

export default function CartPage() {
  const { items, total } = useSelector((state: RootState) => state.cart)

  if (items.length === 0) {
    return (
      <div className="container-max py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">سلة التسوق</h1>
        <p className="text-gray-600 text-lg mb-8">سلة التسوق فارغة</p>
        <Link to="/products" className="btn-primary">
          متابعة التسوق
        </Link>
      </div>
    )
  }

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">سلة التسوق</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 card p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">المنتج</th>
                <th className="text-center py-2">الكمية</th>
                <th className="text-right py-2">السعر</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{item.price * item.quantity} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold">{total} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن:</span>
              <span className="font-bold">مجاني</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold text-primary text-lg">{total} ر.س</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center">
            المتابعة للدفع
          </Link>
          <Link to="/products" className="btn-secondary w-full text-center mt-4">
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  )
}
