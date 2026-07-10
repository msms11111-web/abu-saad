export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Saudi Essence</h3>
            <p className="text-gray-400 text-sm">
              منصة عطور فاخرة سعودية متخصصة في بيع أفضل العطور الأصلية والبخور السعودي.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary mb-4">الروابط السريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-primary transition">الرئيسية</a></li>
              <li><a href="/products" className="hover:text-primary transition">المنتجات</a></li>
              <li><a href="#" className="hover:text-primary transition">المدونة</a></li>
              <li><a href="#" className="hover:text-primary transition">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-primary transition">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-primary transition">شروط الخدمة</a></li>
              <li><a href="#" className="hover:text-primary transition">إرجاع المنتجات</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 info@saudi-essence.com</li>
              <li>📞 +966 12 345 6789</li>
              <li>📍 الرياض، المملكة العربية السعودية</li>
              <li className="mt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-primary hover:text-accent transition">تويتر</a>
                  <a href="#" className="text-primary hover:text-accent transition">انستجرام</a>
                  <a href="#" className="text-primary hover:text-accent transition">فيسبوك</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Saudi Essence. جميع الحقوق محفوظة.</p>
          <p className="mt-2">
            تم التطوير بواسطة <span className="text-primary">Saudi Essence Team</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
