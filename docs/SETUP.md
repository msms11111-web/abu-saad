# دليل التثبيت والإعداد

## المتطلبات الأساسية

- Node.js v18.0.0 أو أحدث
- MongoDB
- Redis (اختياري للـ caching)
- npm أو yarn

## التثبيت السريع

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd saudi-essence
```

### 2. تثبيت المتعلقات
```bash
# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 3. إعداد ملفات البيئة

#### Server (.env)
```bash
cp server/.env.example server/.env
```

قم بتعديل الملف مع قيمك:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saudi-essence
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
```

#### Client (.env)
```bash
cp client/.env.example client/.env
```

### 4. تشغيل التطبيق

#### الطريقة 1: التشغيل المباشر
```bash
# Terminal 1 - Run Backend
cd server
npm run dev

# Terminal 2 - Run Frontend
cd client
npm run dev
```

#### الطريقة 2: استخدام Docker
```bash
docker-compose up
```

#### الطريقة 3: استخدام npm المركزي
```bash
npm run dev
```

## الوصول للتطبيق

- الموقع: http://localhost:5173
- API: http://localhost:5000
- لوحة التحكم: http://localhost:5000/admin

## الحسابات الاختبارية

### حساب العميل
- البريد: customer@example.com
- كلمة المرور: 123456

### حساب الإدارة
- البريد: admin@example.com
- كلمة المرور: admin123

## الخطوات التالية

1. إنشاء حسابات تجريبية
2. إضافة المنتجات الأولى
3. اختبار تدفق الشراء
4. إعداد طريقة الدفع (Stripe)
5. نشر التطبيق

## استكشاف الأخطاء

### المشكلة: فشل الاتصال بـ MongoDB
**الحل:** تأكد من تشغيل MongoDB وتحقق من MONGODB_URI في ملف .env

### المشكلة: خطأ في الترجمة من TypeScript
**الحل:** شغّل `npm run type-check` وصحح الأخطاء

### المشكلة: المنافذ مشغولة
**الحل:** غيّر المنافذ في ملف .env أو أغلق التطبيقات التي تستخدمها

## الموارد الإضافية

- [التوثيق الكاملة](./README_AR.md)
- [دليل التسويق](./MARKETING.md)
- [دليل النشر](./DEPLOYMENT.md)
