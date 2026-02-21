/**
 * Authentication & Authorization Middleware
 * Used in notification routes
 */

import jwt from 'jsonwebtoken';
import { logger } from '../logger.js';

/**
 * Verify JWT token and attach user to request
 */
export function authenticateToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Missing authentication token');
      return res.status(401).json({
        success: false,
        error: 'NO_TOKEN',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        logger.warn('Invalid token', { error: err.message });
        return res.status(403).json({
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        });
      }

      // Attach user to request
      req.user = user;
      next();
    });
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'AUTH_ERROR',
      message: 'Authentication failed',
    });
  }
}

/**
 * Check if user has required role(s)
 */
export function authorizeRole(requiredRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn('Unauthorized: User not authenticated');
        return res.status(401).json({
          success: false,
          error: 'NOT_AUTHENTICATED',
          message: 'User not authenticated',
        });
      }

      if (!requiredRoles.includes(req.user.role)) {
        logger.warn('Unauthorized: Insufficient permissions', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles,
        });
        return res.status(403).json({
          success: false,
          error: 'INSUFFICIENT_PERMISSIONS',
          message: `Required role(s): ${requiredRoles.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      logger.error('Authorization error', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'AUTH_ERROR',
        message: 'Authorization failed',
      });
    }
  };
}

/**
 * Check if user owns resource
 */
export function authorizeOwner(resourceIdParam = 'userId') {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'NOT_AUTHENTICATED',
        });
      }

      const resourceId = req.body[resourceIdParam] || req.params[resourceIdParam];

      if (resourceId !== req.user.id && req.user.role !== 'admin') {
        logger.warn('Unauthorized: Not resource owner', {
          userId: req.user.id,
          resourceId,
        });
        return res.status(403).json({
          success: false,
          error: 'NOT_OWNER',
          message: 'You do not own this resource',
        });
      }

      next();
    } catch (error) {
      logger.error('Ownership authorization error', {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        error: 'AUTH_ERROR',
      });
    }
  };
}

/**
 * Check if user is admin
 */
export function isAdmin(req, res, next) {
  return authorizeRole(['admin'])(req, res, next);
}

/**
 * Optional authentication (doesn't fail if token missing)
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

export default {
  authenticateToken,
  authorizeRole,
  authorizeOwner,
  isAdmin,
  optionalAuth,
};
