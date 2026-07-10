# 🌍 دليل النشر خطوة بخطوة — احصل على رابط عام لموقعك

هذا الدليل يأخذك من الصفر إلى موقع منشور على الإنترنت برابط عام يفتحه أي شخص.
**التكلفة: 0 ريال** — جميع الخدمات المستخدمة مجانية للبداية.

الخطة:

| المكوّن | الخدمة | النتيجة |
|---------|--------|---------|
| قاعدة البيانات | MongoDB Atlas | رابط اتصال آمن |
| الخادم (API) | Render | `https://saudi-essence-api.onrender.com` |
| الواجهة (الموقع) | Vercel | `https://saudi-essence.vercel.app` |

⏱️ الوقت المتوقع: 30–45 دقيقة.

---

## المرحلة 1: قاعدة البيانات — MongoDB Atlas (10 دقائق)

1. افتح **https://www.mongodb.com/cloud/atlas/register** وسجّل بحساب Google.
2. عند السؤال عن نوع النشر اختر **M0 (Free)** — مجاني للأبد.
   - Provider: أي خيار (AWS مناسب)
   - Region: اختر **Bahrain (me-south-1)** إن وُجد — الأقرب للسعودية، وإلا Frankfurt.
3. في شاشة **Security Quickstart**:
   - أنشئ مستخدم قاعدة بيانات: اسم مستخدم + كلمة مرور قوية. **احفظهما — ستحتاجهما بعد قليل.**
4. من القائمة الجانبية: **Network Access** ← **Add IP Address** ← اختر **Allow access from anywhere** (`0.0.0.0/0`).
   - هذا ضروري لأن Render يستخدم عناوين IP متغيرة.
5. من **Database** ← زر **Connect** ← **Drivers** ← انسخ رابط الاتصال، سيكون بهذا الشكل:
   ```
   mongodb+srv://اسم_المستخدم:كلمة_المرور@cluster0.xxxxx.mongodb.net/saudi-essence?retryWrites=true&w=majority
   ```
   ⚠️ استبدل `<password>` بكلمة المرور الحقيقية، وأضف اسم قاعدة البيانات `saudi-essence` بعد `.net/` كما في المثال.

✅ **الناتج:** رابط `MONGODB_URI` جاهز.

---

## المرحلة 2: الخادم — Render (10 دقائق)

المستودع يحتوي على ملف `render.yaml` جاهز يضبط كل شيء تلقائياً.

1. افتح **https://render.com** وسجّل بحساب **GitHub**.
2. من لوحة التحكم: **New** ← **Blueprint**.
3. اختر مستودع **msms11111-web/abu-saad** (وافق على منح Render صلاحية الوصول إن طُلب).
4. اختر الفرع: `claude/saudi-ecommerce-platform-c17vna`
5. سيقرأ Render ملف `render.yaml` ويطلب منك القيم الناقصة:
   - **MONGODB_URI**: الصق رابط Atlas من المرحلة 1
   - **CLIENT_URL**: اتركه مؤقتاً `http://localhost:5173` (سنحدّثه بعد نشر الواجهة)
6. اضغط **Apply** وانتظر اكتمال البناء (3–5 دقائق).
7. عند النجاح ستحصل على رابط مثل:
   ```
   https://saudi-essence-api.onrender.com
   ```
8. **اختبر:** افتح `https://saudi-essence-api.onrender.com/api/health` — يجب أن ترى `{"status":"OK",...}`.

> 💡 ملاحظة الخطة المجانية: الخادم "ينام" بعد 15 دقيقة من عدم الاستخدام، وأول طلب بعدها يستغرق ~30 ثانية. هذا طبيعي ويختفي مع الخطة المدفوعة ($7/شهر).

✅ **الناتج:** رابط API عام يعمل.

---

## المرحلة 3: تعبئة قاعدة البيانات بالمنتجات (5 دقائق)

من جهازك (بعد استنساخ المستودع):

```bash
git clone https://github.com/msms11111-web/abu-saad.git
cd abu-saad/server
npm install
MONGODB_URI="رابط_Atlas_هنا" npm run seed
```

هذا ينشئ 6 منتجات + حسابي الاختبار (العميل والمدير).

✅ **الناتج:** المتجر فيه منتجات وحسابات جاهزة.

---

## المرحلة 4: الواجهة — Vercel (10 دقائق)

1. افتح **https://vercel.com/signup** وسجّل بحساب **GitHub**.
2. **Add New** ← **Project** ← اختر مستودع **abu-saad** ← **Import**.
3. في إعدادات المشروع:
   - **Root Directory**: اضغط Edit واختر **`client`** ← مهم جداً!
   - **Framework Preset**: سيكتشف Vite تلقائياً
   - **Branch**: `claude/saudi-ecommerce-platform-c17vna`
4. افتح قسم **Environment Variables** وأضف:
   | الاسم | القيمة |
   |------|--------|
   | `VITE_API_URL` | `https://saudi-essence-api.onrender.com/api` (رابط Render من المرحلة 2 + `/api`) |
5. اضغط **Deploy** وانتظر دقيقتين.
6. ستحصل على رابطك العام: 🎉
   ```
   https://abu-saad.vercel.app
   ```
   (يمكنك تغيير الاسم من Settings ← Domains)

✅ **الناتج:** موقع منشور برابط عام.

---

## المرحلة 5: الربط النهائي (دقيقتان)

أخبر الخادم برابط الواجهة الجديد حتى يسمح لها بالاتصال (CORS):

1. ارجع إلى **Render** ← خدمة `saudi-essence-api` ← **Environment**.
2. عدّل `CLIENT_URL` إلى رابط Vercel:
   ```
   https://abu-saad.vercel.app
   ```
   (يقبل الحقل أكثر من رابط مفصولة بفواصل إذا احتجت)
3. احفظ — سيُعيد Render تشغيل الخادم تلقائياً.

---

## ✅ الاختبار النهائي

1. افتح رابط Vercel من جوّالك أو أي جهاز.
2. سجّل الدخول بحساب الاختبار:
   - **عميل:** `customer@example.com` / `Customer@123456`
   - **مدير:** `admin@saudi-essence.com` / `Admin@123456`
3. تصفح المنتجات، أضف للسلة، جرّب لوحة الإدارة.

---

## 🌐 خطوات اختيارية بعد النشر

| الخطوة | الفائدة | أين |
|--------|---------|-----|
| نطاق خاص (مثل `saudiessence.sa`) | هوية احترافية | اشترِ من GoDaddy/Namecheap واربطه في Vercel ← Domains |
| Stripe بمفاتيح حقيقية | استقبال مدفوعات فعلية | dashboard.stripe.com ← أضف المفاتيح في Render |
| بريد SMTP حقيقي | رسائل ترحيب وتأكيد طلبات | أنشئ App Password في Gmail وأضف متغيرات SMTP في Render |
| UptimeRobot مجاني | يمنع "نوم" الخادم المجاني | uptimerobot.com ← راقب `/api/health` كل 5 دقائق |

---

## 🆘 حل المشاكل الشائعة

**الموقع يفتح لكن المنتجات لا تظهر:**
- تأكد أن `VITE_API_URL` في Vercel ينتهي بـ `/api`
- تأكد أن `CLIENT_URL` في Render يطابق رابط Vercel بالضبط (بدون `/` في النهاية)
- افتح `رابط_الخادم/api/health` للتأكد أن الخادم مستيقظ

**خطأ في تسجيل الدخول:**
- تأكد أنك نفّذت المرحلة 3 (seed) على قاعدة بيانات Atlas نفسها

**Render يفشل في البناء:**
- تأكد من اختيار الفرع `claude/saudi-ecommerce-platform-c17vna`

**أول تحميل بطيء جداً:**
- طبيعي في الخطة المجانية (الخادم كان نائماً) — استخدم UptimeRobot أعلاه
