# 🌟 Saudi Essence - E-Commerce Platform

**A comprehensive Saudi perfume e-commerce platform with full business integration**

[🇸🇦 اقرأ بالعربية](./README_AR.md)

---

## 🎯 Overview

Saudi Essence is a modern, full-stack e-commerce platform specialized in luxury Saudi perfumes and traditional fragrances. Built with React, Node.js, and MongoDB, it provides a seamless shopping experience for both local and international customers.

---

## ✨ Key Features

### For Customers
- 🛍️ Modern and intuitive product browsing
- 🔍 Advanced search and filtering
- 💳 Secure payment options
- 📱 Mobile-responsive design
- ⭐ Product reviews and ratings
- 🎁 Loyalty rewards program
- 💬 Real-time customer support
- 🌍 Multi-language support (AR/EN)

### For Administrators
- 📊 Comprehensive dashboard
- 📦 Inventory management
- 📈 Sales analytics
- 👥 Customer relationship management
- 🎨 Content management
- 💰 Revenue tracking
- 📧 Email marketing tools

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (React + TypeScript)         │
│   - Vite Build Tool                     │
│   - Tailwind CSS Styling                │
│   - Redux State Management              │
│   - React Router Navigation             │
└────────────┬────────────────────────────┘
             │ REST API + WebSocket
┌────────────────────────────────────────┐
│   Backend (Node.js + Express)          │
│   - Authentication & Security          │
│   - Product Management                 │
│   - Order Processing                   │
│   - Payment Integration                │
│   - Email Notifications                │
└────────────┬───────────────────────────┘
             │ Mongoose ORM
┌────────────────────────────────────────┐
│   Database & Services                  │
│   - MongoDB (Main DB)                  │
│   - Redis (Caching)                    │
│   - Stripe (Payments)                  │
│   - AWS S3 (File Storage)              │
└────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm/yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd saudi-essence
```

2. **Install dependencies**
```bash
# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..
```

3. **Configure environment**
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your credentials
```

4. **Run the application**
```bash
# Option 1: Run both simultaneously
npm run dev

# Option 2: Run separately
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

5. **Access the app**
- Website: http://localhost:5173
- API: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## 📁 Project Structure

```
saudi-essence/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS files
│   │   └── hooks/         # Custom hooks
│   ├── public/            # Static assets
│   ├── index.html         # Entry HTML
│   ├── vite.config.ts     # Vite config
│   └── tailwind.config.js # Tailwind config
│
├── server/                 # Backend (Node.js)
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration
│   │   └── index.ts       # Entry point
│   ├── dist/              # Compiled JS
│   └── tsconfig.json      # TypeScript config
│
├── docs/                   # Documentation
│   ├── SETUP.md           # Setup guide
│   ├── MARKETING.md       # Marketing strategy
│   ├── DEPLOYMENT.md      # Deployment guide
│   ├── ROADMAP.md         # Future plans
│   └── EXECUTIVE_SUMMARY.md # Business summary
│
├── docker-compose.yml      # Docker compose
├── Dockerfile              # Docker image
└── package.json            # Monorepo config
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Routing:** React Router
- **Icons:** Heroicons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Payment:** Stripe API
- **Security:** Helmet, CORS, bcrypt
- **Caching:** Redis
- **File Upload:** Multer

### DevOps
- **Containerization:** Docker
- **Container Orchestration:** Docker Compose
- **Cloud Deployment:** AWS, Vercel
- **CDN:** CloudFlare

---

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: enum['customer', 'admin', 'vendor'],
  address: Object,
  preferences: Object,
  loyaltyPoints: Number,
  orders: [ObjectId],
  wishlist: [ObjectId]
}
```

### Product Collection
```javascript
{
  name: String,
  nameAr: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  images: [String],
  stock: Number,
  rating: Number,
  fragrance: Object,
  specifications: Object,
  vendor: ObjectId,
  isFeature: Boolean
}
```

### Order Collection
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId,
  items: [Object],
  total: Number,
  status: enum[...],
  paymentStatus: enum[...],
  shippingAddress: Object,
  trackingNumber: String
}
```

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Helmet.js for HTTP headers
- ✅ Rate limiting
- ✅ Input validation and sanitization
- ✅ Secure payment processing (Stripe)
- ✅ HTTPS/SSL support
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (MongoDB)

---

## 📈 Performance Optimizations

- ⚡ Code splitting with Vite
- 📦 Image optimization
- 💾 Redis caching
- 🔄 Lazy loading
- 📊 Database indexing
- 🚀 CDN integration
- 🎯 SEO optimization
- 📱 Mobile-first design

---

## 🧪 Testing

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# Type checking
npm run type-check
```

---

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md) - How to set up the project
- [Marketing Strategy](./docs/MARKETING.md) - Marketing and advertising plan
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Roadmap](./docs/ROADMAP.md) - Future features and timeline
- [Executive Summary](./docs/EXECUTIVE_SUMMARY.md) - Business overview

---

## 🚢 Deployment

### Quick Deploy to Production

```bash
# Using Docker
docker build -t saudi-essence .
docker run -p 5000:5000 saudi-essence

# Using Docker Compose
docker-compose -f docker-compose.yml up -d
```

### Deploy Frontend (Vercel)
```bash
cd client
npm install -g vercel
vercel --prod
```

### Deploy Backend (AWS)
See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 💡 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (Require Authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/reviews` - Create product review

### Admin Endpoints
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/admin/analytics` - Get analytics

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Inspired by leading e-commerce platforms
- Built with modern web technologies
- Designed for the Saudi market and beyond

---

## 📞 Contact & Support

- **Email:** info@saudi-essence.com
- **Phone:** +966-12-345-6789
- **Website:** www.saudi-essence.com
- **Location:** Riyadh, Saudi Arabia

---

## 📈 Growth Targets

### Year 1
- 5,000 active customers
- 500,000 SAR revenue
- 4.5+ star rating

### Year 2
- 20,000 active customers
- 2,000,000 SAR revenue
- Expansion to GCC countries

### Year 3
- 50,000+ active customers
- 5,000,000+ SAR revenue
- International presence

---

**Built with ❤️ for the Saudi market and beyond** 🇸🇦✨
