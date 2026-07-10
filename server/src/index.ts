import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { cacheMiddleware } from './middleware/cache.js';
import productsRouter from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Behind Render/Nginx the client IP arrives in X-Forwarded-For; without this
// rate limiting would treat all visitors as one IP (the proxy's)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
// CLIENT_URL accepts a comma-separated list, e.g. "https://app.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Import routes
import authRouter from './routes/auth.js';
import Product from './models/Product.js';
import User from './models/User.js';
import { runSeed } from './utils/seedData.js';

// One-time setup: seeds demo data ONLY while the database is still empty.
// Once any product or user exists it permanently refuses, so it is safe
// to leave enabled in production.
app.get('/api/setup/seed', async (req: Request, res: Response) => {
  try {
    const [productCount, userCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments()
    ]);
    if (productCount > 0 || userCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Database already has data — seeding is disabled'
      });
    }
    const result = await runSeed();
    res.json({
      success: true,
      message: 'Database seeded successfully',
      created: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', cacheMiddleware(3600), productsRouter);
// app.use('/api/orders', ordersRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/reviews', reviewsRouter);
// app.use('/api/analytics', analyticsRouter);

// API Documentation
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Saudi Essence E-Commerce API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      documentation: '/api/docs'
    }
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Connect to database and start server
const startServer = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
