# ⚡ البدء السريع - Quick Start

## 🚀 إطلاق الموقع في 5 دقائق

### الخيار 1: Docker (الأسهل والأسرع) ⭐

```bash
# 1. استنساخ المشروع
git clone https://github.com/msms11111-web/abu-saad.git
cd abu-saad

# 2. إعداد البيئة
cp .env.example .env

# 3. تشغيل بـ Docker
docker-compose up --build

# 4. الوصول للموقع
# الموقع: http://localhost
# الـ API: http://localhost/api
```

### الخيار 2: التشغيل المحلي (بدون Docker)

```bash
# 1. استنساخ المشروع
git clone https://github.com/msms11111-web/abu-saad.git
cd abu-saad

# 2. إعداد البيئة
cp .env.example .env
# عدّل .env بقيمك الخاصة

# 3. تثبيت المتعلقات
npm install

# 4. تشغيل الخادم والموقع
npm run dev

# 5. الوصول
# الموقع: http://localhost:5173
# الـ API: http://localhost:5000
```

---

## 📊 اختبار بسيط

### حساب الاختبار:
```
📧 البريد: customer@example.com
🔐 كلمة المرور: Customer@123456
```

### حساب الإدارة:
```
📧 البريد: admin@saudi-essence.com
🔐 كلمة المرور: Admin@123456
```

---

## 🌍 النشر على الإنترنت

### 1️⃣ Vercel (الموقع الأمامي)
```bash
cd client
npm install -g vercel
vercel --prod
```

### 2️⃣ Heroku (الخادم)
```bash
heroku login
heroku create your-app-name
git push heroku claude/saudi-ecommerce-platform-c17vna:main
```

### 3️⃣ AWS (الطريقة الاحترافية)
اتبع [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📱 المنصات المدعومة

| المنصة | الرابط | الوصف |
|--------|-------|-------|
| 🌐 الموقع الأمامي | http://localhost:5173 | واجهة العملاء |
| 🔌 الخادم الخلفي | http://localhost:5000 | REST API |
| 📊 الإدارة | http://localhost:5173/admin | لوحة التحكم |
| 📚 وثائق API | http://localhost:5000/api | الوثائق |

---

## 🔧 الأوامر المهمة

### تشغيل الخادم فقط
```bash
cd server
npm run dev
```

### تشغيل الموقع فقط
```bash
cd client
npm run dev
```

### ملء قاعدة البيانات ببيانات اختبارية
```bash
cd server
npm run seed
```

### بناء للإنتاج
```bash
npm run build
```

### تشغيل الإصدار الإنتاجي
```bash
npm start
```

---

## 📋 متطلبات النشر

- ✅ حساب MongoDB Atlas (مجاني)
- ✅ حساب Stripe (مجاني للاختبار)
- ✅ بريد Gmail
- ✅ حساب حاسوبي سحابي (AWS/Vercel/Heroku)

---

## 🎯 الخطوات التالية

1. ✅ أنشئ ملف `.env` من `.env.example`
2. ✅ حمّل قاعدة البيانات: `npm run seed`
3. ✅ شغّل الموقع: `npm run dev`
4. ✅ اختبر المنتجات والسلة والدفع
5. ✅ انشر على الإنترنت

---

## 💡 نصائح مهمة

### أثناء التطوير:
```bash
# شاهد التغييرات فوراً
npm run dev

# تتبع الأخطاء
npm run lint

# شغّل الاختبارات
npm test
```

### قبل النشر:
```bash
# تأكد من خلو الأخطاء
npm run build

# اختبر الإصدار الإنتاجي محلياً
npm start
```

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Cannot find module"
```bash
npm install
```

### الخطأ: "Port already in use"
```bash
# غيّر المنفذ في .env
PORT=5001
```

### الخطأ: "Database connection failed"
```bash
# تأكد من:
# 1. MongoDB يعمل
# 2. MONGODB_URI صحيح
# 3. كلمة السر صحيحة
```

---

## 📞 الدعم والمساعدة

- 📖 اقرأ [README.md](./README.md) للتفاصيل الكاملة
- 📚 اقرأ [SETUP.md](./docs/SETUP.md) لدليل الإعداد
- 🚀 اقرأ [DEPLOYMENT.md](./docs/DEPLOYMENT.md) للنشر
- 💬 افتح issue في GitHub للمساعدة

---

**كل شيء جاهز! ابدأ الآن! 🎉**

```bash
docker-compose up --build
```

أو

```bash
npm run dev
```

**النجاح قريب! 🚀**
