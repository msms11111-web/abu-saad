export default function OrderPage() {
  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold mb-8">تفاصيل الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">طلب رقم: ORD-2026-001</h2>
                <p className="text-gray-600">تاريخ الطلب: 10/07/2026</p>
              </div>
              <div className="text-right">
                <span className="badge bg-green-100 text-green-800">تم تسليمه</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <span>عطر أود برفيوم</span>
                <span>299 ر.س</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span>بخور فاخر</span>
                <span>149 ر.س</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="font-bold">الإجمالي:</span>
                <span className="font-bold text-primary">448 ر.س</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">تحديث الشحن</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="font-bold">تم الطلب</p>
                  <p className="text-gray-600 text-sm">10/07/2026</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="font-bold">تم التأكيد</p>
                  <p className="text-gray-600 text-sm">10/07/2026</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="font-bold">تم الشحن</p>
                  <p className="text-gray-600 text-sm">11/07/2026</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div>
                  <p className="font-bold">تم التسليم</p>
                  <p className="text-gray-600 text-sm">13/07/2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>
          <p className="text-sm text-gray-600 mb-4">
            <strong>رقم التتبع:</strong> SA123456789
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>المتلقي:</strong> محمد أحمد<br/>
            شارع الملك فهد<br/>
            الرياض، 12345<br/>
            السعودية
          </p>

          <hr className="my-4" />

          <h3 className="font-bold mb-3">تاريخ الشحن المقدر</h3>
          <p className="text-2xl font-bold text-primary mb-4">13/07/2026</p>

          <button className="btn-secondary w-full mb-2">
            عرض التفاصيل
          </button>
          <button className="btn-primary w-full">
            طباعة الفاتورة
          </button>
        </div>
      </div>
    </div>
  )
}
