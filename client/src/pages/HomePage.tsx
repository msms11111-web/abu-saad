import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-gray-800 text-white py-20">
        <div className="container-max">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              ✨ Saudi Essence ✨
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              عطور فاخرة سعودية أصلية لكل لحظة خاصة
            </p>
            <Link to="/products" className="btn-primary text-lg">
              تسوق الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container-max">
          <h2 className="text-4xl font-bold text-center mb-12">لماذا Saudi Essence؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏆',
                title: 'عطور أصلية',
                desc: 'جميع منتجاتنا مضمونة الأصالة والجودة العالية'
              },
              {
                icon: '📦',
                title: 'توصيل سريع',
                desc: 'توصيل مجاني للطلبات داخل الرياض وشحن آمن لجميع المناطق'
              },
              {
                icon: '💝',
                title: 'برنامج الولاء',
                desc: 'اكسب نقاط على كل عملية شراء واستبدلها بخصومات'
              },
              {
                icon: '🎁',
                title: 'هدايا خاصة',
                desc: 'تغليف فاخر وهدايا مجانية مع الطلبات'
              },
              {
                icon: '👨‍💼',
                title: 'استشارات شخصية',
                desc: 'خبراء متخصصون لمساعدتك في اختيار العطر المناسب'
              },
              {
                icon: '24/7',
                title: 'دعم 24/7',
                desc: 'فريق عمل متاح دائماً للإجابة على استفساراتك'
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-max">
          <h2 className="text-4xl font-bold text-center mb-12">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'عطور الرجال', slug: 'mens', color: 'from-blue-400 to-blue-600' },
              { name: 'عطور النساء', slug: 'womens', color: 'from-pink-400 to-pink-600' },
              { name: 'البخور والعطور الزيتية', slug: 'oils', color: 'from-yellow-400 to-yellow-600' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className={`bg-gradient-to-r ${cat.color} text-white p-8 rounded-lg text-center hover:shadow-lg transition transform hover:scale-105`}
              >
                <h3 className="text-2xl font-bold">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-secondary py-16">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold mb-4">انضم إلى برنامج الولاء الآن</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            احصل على نقاط على كل عملية شراء، واستمتع بخصومات حصرية وعروض خاصة فقط للأعضاء
          </p>
          <Link to="/register" className="btn-secondary text-lg">
            إنشاء حساب الآن
          </Link>
        </div>
      </section>
    </div>
  )
}
