/**
 * Express Routes - Notification Endpoints
 * Production-ready API routes for sending notifications
 * 
 * Usage in your Express app:
 * import notificationRoutes from './routes/notifications.js';
 * app.use('/api/notifications', notificationRoutes);
 */

import express from 'express';
import { body, validationResult, param } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  sendNotification,
  sendBulkNotifications,
  sendToUser,
  notifyOrderPlaced,
  notifyOrderStatus,
  sendPromotion,
  sendCartReminder,
  notifyDelivery,
  notifyPaymentSuccess,
  notifyPaymentFailed,
  sendWithRetry,
} from '../notifications.service.js';
import { logger } from '../logger.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js'; // Your auth middleware

const router = express.Router();

// ==================== RATE LIMITING ====================

const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: 'Too many notification requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const bulkNotificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 bulk sends per hour
  message: 'Too many bulk notification requests',
});

// ==================== MIDDLEWARE ====================

/**
 * Validate notification request
 */
const validateNotification = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be <= 100 characters'),

  body('body')
    .trim()
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ max: 200 })
    .withMessage('Body must be <= 200 characters'),

  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation error in notification request', {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// ==================== ROUTES ====================

/**
 * POST /api/notifications/send
 * Send notification to a specific device token
 */
router.post(
  '/send',
  notificationLimiter,
  authenticateToken,
  validateNotification,
  [
    body('token')
      .trim()
      .notEmpty()
      .withMessage('Device token is required'),
  ],
  async (req, res) => {
    try {
      const { token, title, body, data, retry } = req.body;

      logger.info('Sending notification', {
        token: token.substring(0, 20) + '...',
        userId: req.user.id,
      });

      // Send with or without retry
      const result = retry
        ? await sendWithRetry(token, title, body, { data })
        : await sendNotification(token, title, body, { data });

      if (result.success) {
        return res.json({
          success: true,
          messageId: result.messageId,
          service: result.service,
        });
      }

      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    } catch (error) {
      logger.error('Error in /send endpoint', {
        error: error.message,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/notifications/send-to-user
 * Send notification to user by ID (fetches token from database)
 */
router.post(
  '/send-to-user',
  notificationLimiter,
  authenticateToken,
  validateNotification,
  [
    param('userId')
      .trim()
      .notEmpty()
      .withMessage('User ID is required'),
  ],
  async (req, res) => {
    try {
      const { userId, title, body, data } = req.body;
      const User = req.app.get('User'); // Get User model from app

      if (!User) {
        return res.status(500).json({
          success: false,
          error: 'USER_MODEL_NOT_FOUND',
        });
      }

      logger.info('Sending notification to user', {
        userId,
        sentBy: req.user.id,
      });

      const result = await sendToUser(userId, title, body, {
        data,
        userModel: User,
      });

      if (result.success) {
        return res.json({
          success: true,
          messageId: result.messageId,
          service: result.service,
        });
      }

      if (result.error === 'USER_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
        });
      }

      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    } catch (error) {
      logger.error('Error in /send-to-user endpoint', {
        error: error.message,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/notifications/bulk
 * Send notifications to multiple users
 */
router.post(
  '/bulk',
  bulkNotificationLimiter,
  authenticateToken,
  authorizeRole(['admin']), // Only admins can send bulk
  validateNotification,
  [
    body('userIds')
      .isArray({ min: 1 })
      .withMessage('User IDs must be an array with at least 1 item'),
    body('userIds.*')
      .trim()
      .notEmpty()
      .withMessage('Each user ID must be non-empty'),
  ],
  async (req, res) => {
    try {
      const { userIds, title, body, data, batchSize, delayMs } = req.body;
      const User = req.app.get('User');

      if (!User) {
        return res.status(500).json({
          success: false,
          error: 'USER_MODEL_NOT_FOUND',
        });
      }

      // Get user tokens
      const users = await User.find(
        { _id: { $in: userIds }, pushToken: { $exists: true, $ne: null } },
        { _id: 1, pushToken: 1 }
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'NO_USERS_WITH_TOKENS',
          message: `No users found with push tokens among ${userIds.length} provided`,
        });
      }

      const recipients = users.map((u) => ({
        userId: u._id,
        token: u.pushToken,
      }));

      logger.info('Starting bulk notification send', {
        recipientCount: recipients.length,
        sentBy: req.user.id,
      });

      const result = await sendBulkNotifications(
        recipients,
        title,
        body,
        {
          data,
          batchSize,
          delayMs,
        }
      );

      res.json({
        success: true,
        sent: result.sent,
        failed: result.failed,
        total: result.total,
        errors: result.errors,
      });
    } catch (error) {
      logger.error('Error in /bulk endpoint', {
        error: error.message,
        userId: req.user.id,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: error.message,
      });
    }
  }
);

/**
 * POST /api/notifications/order-placed
 * Notify user when order is placed
 */
router.post(
  '/order-placed',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('orderId').trim().notEmpty().withMessage('Order ID required'),
    body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number'),
  ],
  async (req, res) => {
    try {
      const { userId, orderId, total } = req.body;
      const User = req.app.get('User');

      logger.info('Sending order placed notification', {
        userId,
        orderId,
      });

      const result = await notifyOrderPlaced(userId, orderId, total, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /order-placed endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/order-status
 * Notify user when order status changes
 */
router.post(
  '/order-status',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('orderId').trim().notEmpty().withMessage('Order ID required'),
    body('status')
      .trim()
      .isIn(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    try {
      const { userId, orderId, status } = req.body;
      const User = req.app.get('User');

      logger.info('Sending order status notification', {
        userId,
        orderId,
        status,
      });

      const result = await notifyOrderStatus(userId, orderId, status, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /order-status endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/delivery
 * Notify user when order is out for delivery
 */
router.post(
  '/delivery',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('orderId').trim().notEmpty().withMessage('Order ID required'),
    body('estimatedTime').trim().notEmpty().withMessage('Estimated time required'),
  ],
  async (req, res) => {
    try {
      const { userId, orderId, estimatedTime } = req.body;
      const User = req.app.get('User');

      const result = await notifyDelivery(userId, orderId, estimatedTime, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /delivery endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/payment-success
 * Notify user when payment succeeds
 */
router.post(
  '/payment-success',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('transactionId').trim().notEmpty().withMessage('Transaction ID required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  ],
  async (req, res) => {
    try {
      const { userId, transactionId, amount } = req.body;
      const User = req.app.get('User');

      const result = await notifyPaymentSuccess(userId, transactionId, amount, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /payment-success endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/payment-failed
 * Notify user when payment fails
 */
router.post(
  '/payment-failed',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('transactionId').trim().notEmpty().withMessage('Transaction ID required'),
    body('reason').trim().notEmpty().withMessage('Reason required'),
  ],
  async (req, res) => {
    try {
      const { userId, transactionId, reason } = req.body;
      const User = req.app.get('User');

      const result = await notifyPaymentFailed(userId, transactionId, reason, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /payment-failed endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/promotion
 * Send promotional notification
 */
router.post(
  '/promotion',
  bulkNotificationLimiter,
  authenticateToken,
  authorizeRole(['admin']),
  [
    body('userId').trim().optional(),
    body('title').trim().notEmpty().withMessage('Title required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('offerCode').trim().optional(),
    body('discount').isFloat({ min: 0 }).optional(),
  ],
  async (req, res) => {
    try {
      const { userId, title, description, offerCode, discount } = req.body;
      const User = req.app.get('User');

      logger.info('Sending promotion notification', {
        userId: userId || 'all',
        title,
      });

      if (userId) {
        // Send to single user
        const result = await sendPromotion(
          userId,
          title,
          description,
          offerCode,
          discount,
          { userModel: User }
        );

        if (result.success) {
          return res.json({ success: true });
        }

        return res.status(400).json(result);
      } else {
        // Send to all users with tokens
        const users = await User.find(
          { pushToken: { $exists: true, $ne: null } },
          { _id: 1, pushToken: 1 }
        );

        const recipients = users.map((u) => ({
          userId: u._id,
          token: u.pushToken,
        }));

        const result = await sendBulkNotifications(
          recipients,
          title,
          description,
          {
            data: {
              offerCode,
              discount,
              screen: 'Home',
              type: 'promotion',
            },
          }
        );

        return res.json({
          success: true,
          sent: result.sent,
          failed: result.failed,
        });
      }
    } catch (error) {
      logger.error('Error in /promotion endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/cart-reminder
 * Send abandoned cart reminder
 */
router.post(
  '/cart-reminder',
  notificationLimiter,
  authenticateToken,
  [
    body('userId').trim().notEmpty().withMessage('User ID required'),
    body('itemCount').isInt({ min: 1 }).withMessage('Item count must be >= 1'),
    body('total').isFloat({ min: 0 }).withMessage('Total must be positive'),
  ],
  async (req, res) => {
    try {
      const { userId, itemCount, total } = req.body;
      const User = req.app.get('User');

      const result = await sendCartReminder(userId, itemCount, total, {
        userModel: User,
      });

      if (result.success) {
        return res.json({ success: true });
      }

      res.status(400).json(result);
    } catch (error) {
      logger.error('Error in /cart-reminder endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

/**
 * POST /api/notifications/test
 * Send test notification (for development)
 */
router.post(
  '/test',
  authenticateToken,
  authorizeRole(['admin']),
  [
    body('token').trim().notEmpty().withMessage('Device token required'),
    body('title').optional().trim(),
    body('body').optional().trim(),
  ],
  async (req, res) => {
    try {
      const { token, title, body } = req.body;

      logger.info('Sending test notification', {
        token: token.substring(0, 20) + '...',
        userId: req.user.id,
      });

      const result = await sendNotification(
        token,
        title || 'Test Notification 🎉',
        body || 'Push notifications are working correctly!',
        {
          data: {
            test: true,
            timestamp: new Date().toISOString(),
          },
        }
      );

      if (result.success) {
        return res.json({
          success: true,
          message: 'Test notification sent successfully',
          messageId: result.messageId,
        });
      }

      res.status(400).json({
        success: false,
        error: result.error,
      });
    } catch (error) {
      logger.error('Error in /test endpoint', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
      });
    }
  }
);

// ==================== ERROR HANDLER ====================

router.use((error, req, res, next) => {
  logger.error('Notification route error', {
    error: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message,
  });
});

export default router;
