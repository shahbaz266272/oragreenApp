/**
 * Example Express Server Setup
 * Shows how to integrate notification service into your Express app
 * 
 * Copy this and adapt to your existing server setup
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import initializeFirebase from './firebase-admin.js';
import notificationRoutes from './notifications.routes.js';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== FIREBASE INITIALIZATION ====================

// Initialize Firebase Admin SDK (MUST be done before using Firebase features)
try {
  initializeFirebase();
} catch (error) {
  logger.error('Failed to initialize Firebase', { error: error.message });
  // Continue without Firebase for development
}

// ==================== DATABASE CONNECTION ====================

// Import your User model or database connection
// import User from './models/User.js';
// 
// Connect to MongoDB (example)
// import mongoose from 'mongoose';
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => logger.info('Connected to MongoDB'))
//   .catch(err => logger.error('MongoDB connection error', { error: err.message }));

// ==================== ATTACH MODELS TO APP ====================

// Make models available to routes via app.get()
// This allows routes to access database models
// app.set('User', User);

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'notifications',
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

// Mount notification routes
app.use('/api/notifications', notificationRoutes);

// ==================== OTHER ROUTES ====================

// Your existing routes here
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/products', productRoutes);
// etc...

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(error.status || 500).json({
    success: false,
    error: error.code || 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : error.message,
  });
});

// ==================== SERVER STARTUP ====================

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    nodeEnv: process.env.NODE_ENV,
    port: PORT,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
