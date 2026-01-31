const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Production validation
if (process.env.NODE_ENV === 'production') {
  const { validateProductionConfig } = require('./config/productionValidation');
  validateProductionConfig();
}
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const performanceMonitor = require('./middleware/performanceMonitor');
const logger = require('./config/logger');

// Trust proxy for rate limiting (important for production)
app.set('trust proxy', 1);

// Create upload directories if they don't exist
const createUploadDirectories = () => {
  const uploadDirs = [
    'uploads',
    'uploads/events',
    'uploads/gallery',
    'uploads/testimonials',
    'uploads/slider',
    'uploads/study-materials',
    'uploads/results',
    'uploads/achievements',
    'uploads/faculty'
  ];
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Create directories on startup
createUploadDirectories();

// Sequelize DB connection
const sequelize = require("./config/db");

// Database health check function
const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ Database connection: HEALTHY");
    return true;
  } catch (error) {
    logger.error("❌ Database connection: UNHEALTHY", error.message);
    return false;
  }
};

// Authenticate database connection (safe for production)
sequelize
  .authenticate()
  .then(() => {
    logger.info("Sequelize connected to MySQL");
    checkDatabaseHealth();
  })
  .catch((err) => logger.error("Sequelize connection error:", err));

// Periodic health check (every 5 minutes)
setInterval(checkDatabaseHealth, 5 * 60 * 1000);

// Sync models to reflect schema changes (force sync to fix key issues)
sequelize
  .sync({ force: false }) // Changed from alter to force: false to prevent key conflicts
  .then(() => logger.info("All models synced"))
  .catch((err) => logger.error("Error syncing models:", err));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' },
  xssFilter: true,
  hidePoweredBy: true
}));

// Security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Remove server information
  res.removeHeader('X-Powered-By');
  next();
});

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Performance monitoring
app.use(performanceMonitor);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Global rate limiting (safe limits)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Skip successful requests
  skipFailedRequests: false, // Don't skip failed requests
});
app.use(globalLimiter);

// Rate limiting for login endpoints (more strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: "Too many login attempts, please try again later." },
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});
app.use('/api/auth/login', loginLimiter);
app.use('/api/students/login', loginLimiter);

// Analytics tracking middleware
const analyticsController = require("./controllers/analyticsController");
app.use(analyticsController.trackVisit);

// Serve static files from uploads directory with caching
app.use("/uploads", express.static("uploads", {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true
}));

// Add caching headers for API responses
app.use((req, res, next) => {
  // Cache API responses for 5 minutes (except for sensitive data)
  if (req.path.startsWith('/api/') && req.method === 'GET') {
    // Don't cache admin routes or sensitive data
    if (!req.path.includes('/admin') && !req.path.includes('/auth')) {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
  }
  next();
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://74.176.208.152:3000",
  "http://localhost:3001",
  "https://vagus.vercel.app",
  "https://vagus-update.vercel.app",
  "https://vagusscience.online",
  "https://www.vagusscience.online",
];

// Add production domains
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Admin-Auth"],
  }),
);

// Route Imports
const testimonialRoutes = require("./routes/testimonialRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/admin");
const sliderRoutes = require("./routes/sliderRoutes");
const imageGalleryRoutes = require("./routes/imageGalleryRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");
const popupRoutes = require('./routes/popupRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const leadRoutes = require("./routes/lead");

// Route Mounting
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/image-gallery", imageGalleryRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminStudentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/study-materials", studyMaterialRoutes);
app.use('/api/popup', popupRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/leads", leadRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "NEET Academy API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + "MB"
    }
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  // Log error for debugging
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  // Generic error response (don't expose internal details in production)
  const isProduction = process.env.NODE_ENV === "production";
  res.status(500).json({
    error: isProduction ? "Internal server error" : error.message,
    ...(isProduction ? {} : { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
  
  // Close database connection
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
  
  // Exit process
  process.exit(0);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});
