/**
 * Rate limiting middleware
 */

import rateLimit from 'express-rate-limit';
import { config } from '../constants.js';

/**
 * Create rate limiter middleware
 * 60 requests per minute per IP
 */
export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    error: 'Too Many Requests',
    message: 'You have exceeded the rate limit. Please try again later.',
    retry_after_seconds: Math.ceil(config.rateLimitWindowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
