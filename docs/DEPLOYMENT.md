# 🚀 دليل النشر في البيئة الإنتاجية

## المنصات المدعومة

- ☁️ Vercel (Frontend)
- ☁️ AWS (Backend)
- 🐳 Docker Hub
- 🌐 Heroku (اختياري)

---

## النشر على Vercel (Frontend)

### المتطلبات
- حساب Vercel
- Repository على GitHub

### الخطوات

1. **إضافة مشروعك**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **الإعدادات**
   - اختر مشروع `client`
   - حدد الـ root directory: `client`
   - الأمر: `npm run build`
   - Output directory: `dist`

3. **متغيرات البيئة**
   ```
   VITE_API_URL=https://api.saudi-essence.com
   VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
   ```

4. **النشر**
   ```bash
   vercel --prod
   ```

---

## النشر على AWS (Backend)

### EC2 Instance Setup

1. **إنشاء instance**
   - Image: Ubuntu 22.04 LTS
   - Type: t3.medium (الحد الأدنى)
   - Storage: 30GB

2. **الاتصال والإعداد**
   ```bash
   # تحديث النظام
   sudo apt update && sudo apt upgrade -y

   # تثبيت Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # تثبيت MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   sudo apt-get install -y mongodb-org

   # تثبيت Nginx
   sudo apt-get install -y nginx
   ```

3. **استنساخ المشروع**
   ```bash
   cd /var/www
   sudo git clone <repo-url> saudi-essence
   cd saudi-essence/server
   npm install
   npm run build
   ```

4. **إعداد PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name "saudi-essence-api"
   pm2 startup
   pm2 save
   ```

5. **إعداد Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.saudi-essence.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **تفعيل SSL**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d api.saudi-essence.com
   ```

---

## النشر بـ Docker

### Deployment on AWS ECR

1. **إنشاء ECR Repository**
   ```bash
   aws ecr create-repository --repository-name saudi-essence
   ```

2. **بناء وتحميل الصورة**
   ```bash
   # تسجيل الدخول
   aws ecr get-login-password --region me-south-1 | \
     docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.me-south-1.amazonaws.com

   # بناء الصورة
   docker build -t saudi-essence .

   # وضع العلامة
   docker tag saudi-essence:latest \
     [ACCOUNT_ID].dkr.ecr.me-south-1.amazonaws.com/saudi-essence:latest

   # تحميل
   docker push [ACCOUNT_ID].dkr.ecr.me-south-1.amazonaws.com/saudi-essence:latest
   ```

### ECS Deployment

1. **إنشاء Cluster**
   ```bash
   aws ecs create-cluster --cluster-name saudi-essence
   ```

2. **إنشاء Task Definition**
   ```json
   {
     "family": "saudi-essence",
     "containerDefinitions": [
       {
         "name": "api",
         "image": "[ACCOUNT_ID].dkr.ecr.me-south-1.amazonaws.com/saudi-essence:latest",
         "portMappings": [{"containerPort": 5000}],
         "environment": [
           {"name": "NODE_ENV", "value": "production"},
           {"name": "PORT", "value": "5000"}
         ]
       }
     ]
   }
   ```

---

## إعداد RDS (قاعدة البيانات)

### MongoDB Atlas (الخيار الموصى به)

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني
3. أنشئ Cluster
4. احصل على Connection String
5. أضفه إلى متغيرات البيئة

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saudi-essence?retryWrites=true&w=majority
```

### AWS RDS (اختياري)

```bash
aws rds create-db-instance \
  --db-instance-identifier saudi-essence-db \
  --db-instance-class db.t3.micro \
  --engine mongodb \
  --master-username admin \
  --master-user-password YourPassword123
```

---

## إعداد CDN

### CloudFlare

1. أضف مجالك
2. غيّر Name Servers
3. فعّل الـ caching
4. أضف rules الأمان

---

## مراقبة وتحليلات

### Application Monitoring
```bash
# تثبيت New Relic
npm install newrelic

# استخدام Datadog
npm install dd-trace
```

### Log Management
```bash
# CloudWatch Logs
aws logs create-log-group --log-group-name /saudi-essence/api
```

---

## قائمة التحقق قبل الإطلاق

- [ ] جميع المتغيرات البيئية مضبوطة
- [ ] SSL/HTTPS مفعّل
- [ ] قاعدة البيانات محمية بـ firewall
- [ ] النسخ الاحتياطية مُجدولة
- [ ] المراقبة والتنبيهات جاهزة
- [ ] جميع الاختبارات تمرّ
- [ ] CORS مُكوّن بشكل آمن
- [ ] Rate limiting فعّال
- [ ] رسائل الخطأ لا تكشف معلومات حساسة

---

## الصيانة المستمرة

### التحديثات الأسبوعية
```bash
npm update
npm audit
```

### النسخ الاحتياطية اليومية
```bash
# MongoDB
mongodump --uri "mongodb://..." --out ./backup/$(date +%Y%m%d)
```

### المراقبة
- تحقق من استخدام الذاكرة
- راقب معدل الأخطاء
- تتبع أداء قاعدة البيانات

---

## حل المشاكل الشائعة

### المشكلة: خطأ في الاتصال
**الحل:** تحقق من Security Groups و Firewall rules

### المشكلة: استهلاك عالي للذاكرة
**الحل:** زيادة حجم Instance أو تحسين التطبيق

### المشكلة: قاعدة البيانات بطيئة
**الحل:** أضف indexes وقم بـ database optimization
