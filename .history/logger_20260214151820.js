/**
 * Logger Utility
 * Production-ready logging with Winston
 * Can be easily swapped with your existing logger
 */

// If you don't have Winston installed, here's a simple logger:

export const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },

  warn: (message, data = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  },

  error: (message, data = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, data);
  },

  debug: (message, data = {}) => {
    if (process.env.DEBUG === 'true') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  },
};

// ==================== WINSTON SETUP (if you want advanced logging) ====================
// import winston from 'winston';
//
// export const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json()
//   ),
//   defaultMeta: { service: 'notifications' },
//   transports: [
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'logs/combined.log' }),
//   ],
// });
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       ),
//     })
//   );
// }

export default logger;
